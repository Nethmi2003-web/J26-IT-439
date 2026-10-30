import json
from pathlib import Path
from typing import Literal, Optional

import joblib
import numpy as np
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field


MODEL_DIR = Path(__file__).resolve().parent / "models" / "v2"
DISCLAIMER = (
    "Estimate applies to the studied coconut-oil / palm-oil mixtures. "
    "Not a certification of food safety or purity."
)

# Dataset1: class 1 is pure coconut oil, each class adds 5% palm oil (class 9 = 40%).
ADULTERATION_STEP_PERCENT = 5

# Coarse category per palm-oil percentage (proposal output 2). Limits to be
# confirmed with the supervisor.
CATEGORIES = [
    ("Pure", 0, 0),
    ("Low", 5, 10),
    ("Medium", 15, 25),
    ("High", 30, 40),
]

bundle = joblib.load(MODEL_DIR / "band_models.joblib")
results = json.loads((MODEL_DIR / "results.json").read_text())
BANDS: list[int] = bundle["bands"]
CRITICAL_BAND: int = bundle["critical_band"]
MODE_BANDS = {"full": tuple(bundle["full_bands"]), "reduced": tuple(bundle["reduced_bands"])}

app = FastAPI(title="Coconut Oil Adulteration Classification API", version="2.0.0")


def adulteration_percent(label: int) -> int:
    return (label - 1) * ADULTERATION_STEP_PERCENT


def category_for(percent: int) -> str:
    return next(name for name, low, high in CATEGORIES if low <= percent <= high)


def band_field():
    return Field(default=None, ge=0, le=255)


class SpectralInput(BaseModel):
    mode: Literal["full", "reduced"] = "full"
    SpectralBand_405nm: Optional[float] = band_field()
    SpectralBand_430nm: Optional[float] = band_field()
    SpectralBand_505nm: Optional[float] = band_field()
    SpectralBand_590nm: Optional[float] = band_field()
    SpectralBand_660nm: Optional[float] = band_field()
    SpectralBand_740nm: Optional[float] = band_field()
    SpectralBand_850nm: Optional[float] = band_field()
    SpectralBand_890nm: Optional[float] = band_field()
    SpectralBand_950nm: Optional[float] = band_field()

    def readings(self) -> dict[int, float]:
        values = {band: getattr(self, f"SpectralBand_{band}nm") for band in BANDS}
        return {band: value for band, value in values.items() if value is not None}


class PredictionError(ValueError):
    pass


def distribution_check(readings: dict[int, float], used: tuple[int, ...]) -> dict:
    """Refuse inputs unlike the training data; LDA would otherwise classify them confidently.

    Squared Mahalanobis distance (log1p space) to the nearest class mean, using the
    pooled within-class covariance that LDA itself assumes.
    """
    ood = bundle["ood"]
    idx = [BANDS.index(band) for band in used]
    margin = ood["range_margin"]
    outside = [
        f"{band} nm = {readings[band]:g} (expected {ood['band_min'][i] - margin:g} to {ood['band_max'][i] + margin:g})"
        for band, i in zip(used, idx)
        if not ood["band_min"][i] - margin <= readings[band] <= ood["band_max"][i] + margin
    ]
    if outside:
        raise PredictionError(
            "Readings are outside the range seen for coconut/palm oil, so no class is given: " + "; ".join(outside)
        )

    x = np.log1p(np.array([readings[band] for band in used], dtype=float))
    diff = x - ood["means"][:, idx]
    precision = np.linalg.inv(ood["covariance"][np.ix_(idx, idx)])
    distance = float(np.einsum("kp,pq,kq->k", diff, precision, diff).min())
    limits = ood["thresholds"][used]
    if distance > limits["reject"]:
        raise PredictionError(
            f"This spectrum does not match any coconut/palm oil mixture the model was trained on "
            f"(distance {distance:.0f}, limit {limits['reject']:.0f}), so no class is given. "
            "Check the sensor and the readings."
        )
    return {
        "distance": distance,
        "warn_threshold": limits["warn"],
        "reject_threshold": limits["reject"],
        "typical": distance <= limits["warn"],
    }


def predict_one(readings: dict[int, float], mode: str) -> dict:
    requested = MODE_BANDS[mode]
    used = tuple(band for band in requested if band in readings)
    missing = [band for band in requested if band not in readings]
    ignored = sorted(band for band in readings if band not in requested)
    if not used:
        raise PredictionError(f"None of the bands needed for {mode} mode were provided: {list(requested)}")
    distribution = distribution_check(readings, used)

    # Use the LDA trained on exactly the available bands (retraining, not imputation).
    entry = bundle["models"][used]
    model = entry["model"]
    features = np.log1p(np.array([[readings[band] for band in used]], dtype=float))
    probabilities = model.predict_proba(features)[0]
    label = int(model.classes_[probabilities.argmax()])
    percent = adulteration_percent(label)

    warnings = []
    low_confidence = CRITICAL_BAND in missing
    if low_confidence:
        warnings.append(
            f"The {CRITICAL_BAND} nm band is missing. This band is critical; expected accuracy drops to "
            f"{entry['cv_accuracy']:.0%}. Re-measure the sample before relying on this result."
        )
    elif missing:
        warnings.append(f"Bands missing: {', '.join(f'{b} nm' for b in missing)}. A model retrained without them was used.")
    if not distribution["typical"]:
        warnings.append(
            "These readings are unusual compared with the averaged training samples (they look like a single "
            "noisy pixel or a different oil). Average the readings over the sample area before relying on this result."
        )

    return {
        "prediction": label,
        "adulteration_percent": percent,
        "category": category_for(percent),
        "confidence": float(probabilities.max()),
        "probabilities": {str(int(cls)): float(p) for cls, p in zip(model.classes_, probabilities)},
        "status": "Incomplete" if missing else "Complete",
        "requested_mode": mode,
        "model_mode": "Full-band" if len(used) == len(BANDS) else "Reduced-band",
        "bands_used": list(used),
        "bands_missing": missing,
        "bands_ignored": ignored,
        "expected_accuracy": entry["cv_accuracy"],
        "low_confidence": low_confidence,
        "distribution": distribution,
        "warnings": warnings,
        "model_version": bundle["version"],
        "disclaimer": DISCLAIMER,
    }


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "model_version": bundle["version"]}


@app.get("/model-info")
def model_info() -> dict:
    return {
        "algorithm": "Linear Discriminant Analysis",
        "model_version": bundle["version"],
        "bands": BANDS,
        "modes": {mode: list(bands) for mode, bands in MODE_BANDS.items()},
        "critical_band": CRITICAL_BAND,
        "classes": [
            {"label": label, "adulteration_percent": adulteration_percent(label),
             "category": category_for(adulteration_percent(label))}
            for label in range(1, 10)
        ],
        "categories": [{"name": name, "min_percent": low, "max_percent": high} for name, low, high in CATEGORIES],
        "disclaimer": DISCLAIMER,
        "results": results,
    }


@app.post("/predict")
def predict(data: SpectralInput) -> dict:
    try:
        return predict_one(data.readings(), data.mode)
    except PredictionError as error:
        # Same shape as FastAPI validation errors so clients handle both alike.
        raise HTTPException(status_code=422, detail=[{"msg": str(error)}])
