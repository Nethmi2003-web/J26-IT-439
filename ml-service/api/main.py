"""FastAPI service that exposes trained models to the Express API.

Run from the ml-service folder:
    uvicorn api.main:app --reload --port 8000

Each endpoint currently returns placeholder output. Replace the bodies with calls
into the component packages under src/ once models are trained and saved to
artifacts/models/.
"""

from datetime import date

from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="Coconut Research ML Service", version="0.1.0")


class ExportForecastRequest(BaseModel):
    product: str
    horizon: int = 6


class CrownPredictRequest(BaseModel):
    imagePath: str


class DroughtPredictRequest(BaseModel):
    district: str
    horizonMonths: int = 3


class HotspotRequest(BaseModel):
    startDate: date | None = None
    endDate: date | None = None


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/export/forecast")
def export_forecast(req: ExportForecastRequest):
    # TODO: load model from artifacts/models/component_1 and forecast.
    return {"product": req.product, "horizon": req.horizon, "forecast": [], "placeholder": True}


@app.post("/crown/predict")
def crown_predict(req: CrownPredictRequest):
    # TODO: run component_2_crown_detection inference on the image.
    return {"imagePath": req.imagePath, "label": None, "confidence": None, "placeholder": True}


@app.post("/drought/predict")
def drought_predict(req: DroughtPredictRequest):
    # TODO: run component_3_drought_forecasting model.
    return {"district": req.district, "riskIndex": None, "riskLevel": None, "placeholder": True}


@app.post("/spatial/hotspots")
def spatial_hotspots(req: HotspotRequest):
    # TODO: run component_4_spatial_risk hotspot detection.
    return {"hotspots": [], "placeholder": True}
