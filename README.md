# Coconut Oil Adulteration Classification

This branch contains a prototype for classifying coconut-oil samples according
to their palm-oil adulteration level. The system accepts spectral-band
readings, uses a trained Linear Discriminant Analysis (LDA) model, and returns
the predicted class, adulteration percentage, confidence, and warnings for
incomplete or unusual readings.

## Project structure

```text
.
├── app.py                 # FastAPI ML prediction service
├── server.js              # Node.js API entry point
├── schema.sql             # PostgreSQL predictions table
├── backend/               # TypeScript backend scaffold
├── frontend/              # React + Vite frontend
├── ml-service/            # FastAPI service scaffold and training scripts
└── docker-compose.yml     # Docker services for the planned deployment
```

## Classification model

The model uses these spectral bands:

`405, 430, 505, 590, 660, 740, 850, 890, 950 nm`

There are nine classes:

- Class 1: pure coconut oil
- Classes 2-9: 5% to 40% palm-oil adulteration in 5% increments

The API also groups predictions into `Pure`, `Low`, `Medium`, and `High`
categories. This result is an estimate for the mixtures represented in the
training data; it is not a food-safety or purity certification.

## Prerequisites

- Python 3.11 or newer
- Node.js 16 or newer
- npm
- PostgreSQL, if prediction history is enabled

## Run the ML API

The root `app.py` loads model artifacts from `models/v2/`. Ensure the trained
model bundle and `results.json` are available in that directory before
starting the service.

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python -m uvicorn app:app --reload --port 8000
```

The interactive API documentation is available at
`http://localhost:8000/docs`.

### ML API endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Returns service and model status |
| `GET` | `/model-info` | Returns model metadata, bands, classes, and evaluation results |
| `POST` | `/predict` | Classifies a spectral reading |

Example request:

```json
{
  "mode": "full",
  "SpectralBand_405nm": 120,
  "SpectralBand_430nm": 125,
  "SpectralBand_505nm": 130,
  "SpectralBand_590nm": 140,
  "SpectralBand_660nm": 150,
  "SpectralBand_740nm": 160,
  "SpectralBand_850nm": 170,
  "SpectralBand_890nm": 175,
  "SpectralBand_950nm": 180
}
```

The `mode` value can be `full` or `reduced`. Values must be between `0` and
`255`. Missing bands are reported in the response; readings outside the
training distribution are rejected instead of receiving an unreliable class.

## Run the frontend and backend scaffold

Install dependencies and start the frontend:

```powershell
cd frontend
npm install
npm run dev
```

The frontend runs at `http://localhost:5173`.

The TypeScript backend can be started separately:

```powershell
cd backend
npm install
npm run dev
```

The backend runs at `http://localhost:5000`. Copy the relevant `.env.example`
file to `.env` before starting a service and update the connection URLs as
needed.

## Environment variables

The main environment settings are:

| Variable | Default | Purpose |
|---|---|---|
| `PORT` | `5000` | Backend port |
| `CLIENT_URL` | `http://localhost:5173` | Allowed frontend origin |
| `ML_SERVICE_URL` | `http://localhost:8000` | ML API URL |
| `MONGODB_URI` | `mongodb://localhost:27017/project_database` | Database connection |
| `VITE_API_URL` | `http://localhost:5000/api` | Frontend API base URL |

Do not commit `.env` files or model credentials. Use the checked-in
`.env.example` files as templates.

## Database

`schema.sql` defines the `predictions` table used to store spectral readings,
model output, confidence, warnings, and timestamps. Apply it to PostgreSQL
only after configuring the database connection for the service that writes
prediction history.

## Current branch status

This branch focuses on the coconut-oil adulteration prediction flow. The
frontend and TypeScript backend folders provide the application structure and
health-check integration, while the root FastAPI application contains the
current model prediction logic. Training utilities and their documentation
are available under `ml-service/training/`.
