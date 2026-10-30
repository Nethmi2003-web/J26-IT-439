-- Ceyora database schema: the full, current structure.
-- Apply with `npm run db:init` (from the server folder). It runs this file and then
-- any pending files in database/migrations/ (tracked in schema_migrations).
-- To change the structure: add a numbered migration AND update this file to match.

CREATE TABLE IF NOT EXISTS predictions (
    id SERIAL PRIMARY KEY,
    sample_name VARCHAR(100) NOT NULL DEFAULT '',
    source VARCHAR(10) NOT NULL DEFAULT 'manual' CHECK (source IN ('manual', 'csv')),

    -- Spectral band readings (pixel intensity 0-255); NULL = band not measured
    band_405nm REAL CHECK (band_405nm BETWEEN 0 AND 255),
    band_430nm REAL CHECK (band_430nm BETWEEN 0 AND 255),
    band_505nm REAL CHECK (band_505nm BETWEEN 0 AND 255),
    band_590nm REAL CHECK (band_590nm BETWEEN 0 AND 255),
    band_660nm REAL CHECK (band_660nm BETWEEN 0 AND 255),
    band_740nm REAL CHECK (band_740nm BETWEEN 0 AND 255),
    band_850nm REAL CHECK (band_850nm BETWEEN 0 AND 255),
    band_890nm REAL CHECK (band_890nm BETWEEN 0 AND 255),
    band_950nm REAL CHECK (band_950nm BETWEEN 0 AND 255),

    -- Model output: class 1 = pure coconut oil, each class adds 5% palm oil
    predicted_class SMALLINT NOT NULL CHECK (predicted_class BETWEEN 1 AND 9),
    adulteration_percent SMALLINT NOT NULL,
    category VARCHAR(10) NOT NULL CONSTRAINT predictions_category_check CHECK (category IN ('Pure', 'Low', 'Medium', 'High')),
    confidence REAL NOT NULL,
    probabilities JSONB NOT NULL,

    -- Measurement status and band mode (FR3, FR4)
    requested_mode VARCHAR(10) NOT NULL CONSTRAINT predictions_requested_mode_check CHECK (requested_mode IN ('full', 'reduced')),
    model_mode VARCHAR(20) NOT NULL,
    status VARCHAR(12) NOT NULL CONSTRAINT predictions_status_check CHECK (status IN ('Complete', 'Incomplete')),
    bands_used SMALLINT[] NOT NULL,
    bands_missing SMALLINT[] NOT NULL DEFAULT '{}',
    expected_accuracy REAL,
    low_confidence BOOLEAN NOT NULL DEFAULT FALSE,
    -- Accepted, but far from the averaged training samples (e.g. a single noisy pixel)
    unusual_reading BOOLEAN NOT NULL DEFAULT FALSE,
    warnings JSONB NOT NULL DEFAULT '[]',
    model_version VARCHAR(20) NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS predictions_created_at_idx ON predictions (created_at DESC);
