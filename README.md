# AI-Driven Multimodal Coconut Plantation Risk Assessment, Spatial Disease Propagation and Export Forecasting System

A full-stack research platform. It uses **PostgreSQL, Express, React and Node** for the web application and **Python** for model training and serving.

It covers four research components:

1. Multi-Product Export Forecasting
2. Coconut Crown Health and Disease Symptom Detection
3. Water Stress, Drought and Future Forecast Risk Modelling
4. Spatial Risk Propagation and Hotspot Detection (WCLWD)

## Architecture

```text
React (client, :5173) ──► Express API (server, :5000) ──► PostgreSQL (:5432)
                                     │                          ▲
                                     ▼                          │
                         FastAPI ML service (ml-service, :8000) ┘
                         (loads trained models, reads training data)
```

- The **client** only talks to the Express API, through the Vite `/api` proxy.
- The **server** owns the business data in PostgreSQL. It calls the ML service for predictions.
- The **ml-service** holds all Python research code: training pipelines, notebooks, and a FastAPI app that serves trained models. Training scripts read from and write to the same PostgreSQL database through `src/common/db.py`.

## Repository structure

```text
research-project/
├── package.json        # npm workspaces (client + server) and dev scripts
├── client/             # React + Vite front end
│   └── src/ (pages/, components/, hooks/, api.js)
├── server/             # Express + node-postgres API
│   ├── src/ (app.js, index.js, config/, routes/)
│   └── scripts/initDb.js
├── database/           # PostgreSQL schema.sql and seed.sql
├── ml-service/         # Python: training + model serving
│   ├── api/main.py     # FastAPI app
│   ├── src/            # component packages (component_1 … component_4, common, integration)
│   ├── configs/ data/ notebooks/ tests/ artifacts/ reports/ scripts/
│   ├── requirements.txt
│   └── pyproject.toml
└── docs/               # architecture, methodology, evaluation, data dictionary
```

## Prerequisites

- Node.js 20+
- Python 3.10–3.12
- PostgreSQL 14+ (needs to be running locally)

## Setup

### 1. Database

Create an empty database, for example with pgAdmin or `psql`:

```sql
CREATE DATABASE coconut_research;
```

### 2. Node (server + client)

From the project root:

```bat
npm install
copy server\.env.example server\.env
```

Edit `server\.env` and set `DATABASE_URL` to your PostgreSQL username and password. Then create the tables:

```bat
npm run db:init
```

### 3. Python ML service

```bat
cd ml-service
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
cd ..
```

Note: `torch` and `tensorflow` are large downloads. Comment them out in `requirements.txt` if you do not need them yet.

## Running

Open two terminals in the project root:

```bat
npm run dev       :: Express (5000) + React (5173)
npm run dev:ml    :: FastAPI ML service (8000)
```

Open http://localhost:5173. The Overview page shows whether the API, the database and the ML service are reachable.

## Research boundaries

- Component 2 uses visible symptom data only and should not be treated as a direct diagnosis.
- Component 3 models environmental risk and should not be interpreted as direct palm-level physiological measurements.
- Component 4 treats wind as a potential spread proxy until domain experts validate it.
