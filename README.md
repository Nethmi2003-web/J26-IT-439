# Python ML service

This service loads the trained Random Forest model and exposes it over HTTP.

## Run locally

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python -m uvicorn app:app --reload --port 8000
```

Open `http://localhost:8000/docs` to use the FastAPI test interface.
