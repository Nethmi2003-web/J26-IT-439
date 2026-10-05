# ML Service - Python FastAPI

This is the Python FastAPI machine learning service for the MERN + ML Service project.

## Technology Stack

- **FastAPI**: Modern web framework for building APIs
- **Uvicorn**: ASGI server
- **Pydantic**: Data validation and serialization
- **NumPy**: Numerical computing
- **Pandas**: Data manipulation
- **Scikit-learn**: Machine learning library
- **Joblib**: Model serialization
- **Python-dotenv**: Environment variable management

## Project Structure

```
ml-service/
├── app/
│   ├── api/                  # API route handlers
│   ├── models/               # ML model classes
│   ├── schemas/              # Pydantic request/response schemas
│   │   └── prediction.py     # Prediction schemas
│   ├── services/             # Business logic services
│   ├── utils/                # Utility functions
│   └── main.py               # FastAPI app and routes
│
├── training/
│   ├── dataset/              # Training datasets
│   ├── preprocessing.py      # Data preprocessing
│   ├── train.py              # Model training
│   ├── evaluate.py           # Model evaluation
│   └── README.md             # Training documentation
│
├── trained_models/           # Saved trained models
├── requirements.txt          # Python dependencies
├── .env.example              # Example environment variables
└── README.md                 # This file
```

## Prerequisites

- Python 3.11 or higher
- pip (Python package manager)

## Installation

Create a virtual environment:

```bash
cd ml-service
python -m venv .venv
```

Activate the virtual environment:

**On macOS/Linux:**
```bash
source .venv/bin/activate
```

**On Windows:**
```bash
.venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

## Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Configure the variables:
- `PORT`: Server port (default: 8000)
- `ML_MODEL_PATH`: Path to trained models
- `DEBUG`: Debug mode (True/False)

## Development

Start the FastAPI development server:

```bash
uvicorn app.main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`

Interactive API documentation: `http://localhost:8000/docs`

Alternative documentation: `http://localhost:8000/redoc`

## Health Check Endpoint

```
GET /api/ml/health
```

Response:
```json
{
  "success": true,
  "message": "ML service is running"
}
```

## API Endpoints (TO BE IMPLEMENTED)

### Prediction
```
POST /api/ml/predict
```

Request (NOT IMPLEMENTED):
```json
{
  "features": [1.0, 2.0, 3.0]
}
```

Response (NOT IMPLEMENTED):
```json
{
  "success": false,
  "message": "Predict endpoint not implemented yet"
}
```

### Training
```
POST /api/ml/train
```

Request/Response: NOT IMPLEMENTED

### Model Info
```
GET /api/ml/model
```

Response: NOT IMPLEMENTED

### Metrics
```
GET /api/ml/metrics
```

Response: NOT IMPLEMENTED

## CORS Configuration

CORS is configured to allow requests from any origin. In production, restrict this to your frontend domain:

```python
allow_origins=["http://localhost:5173", "https://yourdomain.com"]
```

## Project Status

This is a skeleton project structure. All endpoints currently return "Not implemented yet" responses.

## Implementation Checklist

- [ ] Implement data preprocessing in `training/preprocessing.py`
- [ ] Implement model training in `training/train.py`
- [ ] Implement model evaluation in `training/evaluate.py`
- [ ] Train and save models to `trained_models/`
- [ ] Implement prediction logic in `app/services/`
- [ ] Implement `/api/ml/predict` endpoint
- [ ] Implement `/api/ml/train` endpoint
- [ ] Implement `/api/ml/model` endpoint
- [ ] Implement `/api/ml/metrics` endpoint
- [ ] Add input validation with Pydantic schemas
- [ ] Add error handling and logging
- [ ] Add authentication/authorization (if needed)
- [ ] Add request/response examples to docs

## Notes

- FastAPI automatically generates OpenAPI documentation at `/docs`
- Schemas are defined in `app/schemas/prediction.py`
- All endpoints return clear "Not implemented" messages
- No fake data or mock predictions are provided
- Model loading and prediction logic should be added to services
- Training workflow is documented but not implemented

## Future Enhancements

- Database integration for storing predictions
- Asynchronous job queue for long-running training tasks
- Model versioning and A/B testing
- Monitoring and alerting
- Rate limiting and authentication
- Docker containerization
- CI/CD integration
