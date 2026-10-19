-- PostgreSQL schema for the coconut research platform.
-- Safe to re-run: every object uses IF NOT EXISTS.

-- ---------------------------------------------------------------------------
-- Shared reference data
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS districts (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL UNIQUE,
    province    VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS plantations (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(150) NOT NULL,
    district_id INTEGER REFERENCES districts(id) ON DELETE SET NULL,
    latitude    NUMERIC(9, 6),
    longitude   NUMERIC(9, 6),
    area_ha     NUMERIC(10, 2),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tracks every trained model version across all four components.
CREATE TABLE IF NOT EXISTS model_runs (
    id            SERIAL PRIMARY KEY,
    component     VARCHAR(50) NOT NULL,          -- export | crown | drought | spatial
    model_name    VARCHAR(100) NOT NULL,
    version       VARCHAR(50) NOT NULL,
    metrics       JSONB NOT NULL DEFAULT '{}',
    artifact_path TEXT,
    is_active     BOOLEAN NOT NULL DEFAULT FALSE,
    trained_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- Component 1: Multi-product export forecasting
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS export_records (
    id           SERIAL PRIMARY KEY,
    product      VARCHAR(100) NOT NULL,          -- e.g. desiccated coconut, coconut oil
    period_month DATE NOT NULL,                  -- first day of the month
    volume_mt    NUMERIC(14, 2),
    value_lkr    NUMERIC(18, 2),
    destination  VARCHAR(100),
    UNIQUE (product, period_month, destination)
);

CREATE TABLE IF NOT EXISTS export_forecasts (
    id           SERIAL PRIMARY KEY,
    model_run_id INTEGER REFERENCES model_runs(id) ON DELETE CASCADE,
    product      VARCHAR(100) NOT NULL,
    period_month DATE NOT NULL,
    volume_mt    NUMERIC(14, 2),
    value_lkr    NUMERIC(18, 2),
    lower_bound  NUMERIC(18, 2),
    upper_bound  NUMERIC(18, 2),
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- Component 2: Crown health and disease symptom detection
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS crown_images (
    id            SERIAL PRIMARY KEY,
    plantation_id INTEGER REFERENCES plantations(id) ON DELETE SET NULL,
    file_path     TEXT NOT NULL,
    captured_at   TIMESTAMPTZ,
    uploaded_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS crown_predictions (
    id           SERIAL PRIMARY KEY,
    image_id     INTEGER NOT NULL REFERENCES crown_images(id) ON DELETE CASCADE,
    model_run_id INTEGER REFERENCES model_runs(id) ON DELETE SET NULL,
    label        VARCHAR(100) NOT NULL,          -- visible symptom class, not a diagnosis
    confidence   NUMERIC(5, 4),
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- Component 3: Water stress and drought risk
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS climate_observations (
    id               SERIAL PRIMARY KEY,
    district_id      INTEGER NOT NULL REFERENCES districts(id) ON DELETE CASCADE,
    observed_on      DATE NOT NULL,
    rainfall_mm      NUMERIC(8, 2),
    temperature_c    NUMERIC(5, 2),
    humidity_pct     NUMERIC(5, 2),
    soil_moisture    NUMERIC(6, 3),
    evapotranspiration_mm NUMERIC(8, 2),
    UNIQUE (district_id, observed_on)
);

CREATE TABLE IF NOT EXISTS drought_risk (
    id           SERIAL PRIMARY KEY,
    district_id  INTEGER NOT NULL REFERENCES districts(id) ON DELETE CASCADE,
    model_run_id INTEGER REFERENCES model_runs(id) ON DELETE SET NULL,
    period_start DATE NOT NULL,
    risk_index   NUMERIC(6, 3),
    risk_level   VARCHAR(20),                    -- low | moderate | high | severe
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- Component 4: Spatial risk propagation and hotspot detection (WCLWD)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS disease_reports (
    id            SERIAL PRIMARY KEY,
    plantation_id INTEGER REFERENCES plantations(id) ON DELETE CASCADE,
    reported_on   DATE NOT NULL,
    latitude      NUMERIC(9, 6),
    longitude     NUMERIC(9, 6),
    severity      SMALLINT CHECK (severity BETWEEN 0 AND 5),
    infected_palms INTEGER,
    notes         TEXT
);

CREATE TABLE IF NOT EXISTS hotspots (
    id           SERIAL PRIMARY KEY,
    model_run_id INTEGER REFERENCES model_runs(id) ON DELETE SET NULL,
    latitude     NUMERIC(9, 6) NOT NULL,
    longitude    NUMERIC(9, 6) NOT NULL,
    radius_km    NUMERIC(8, 3),
    risk_score   NUMERIC(6, 4),
    detected_on  DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE INDEX IF NOT EXISTS idx_export_records_month ON export_records (period_month);
CREATE INDEX IF NOT EXISTS idx_climate_district_date ON climate_observations (district_id, observed_on);
CREATE INDEX IF NOT EXISTS idx_disease_reports_date ON disease_reports (reported_on);
