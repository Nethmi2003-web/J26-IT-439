 C1: Multi-Product Coconut Export Volume and Value Forecasting
📌 Overview
This repository contains the implementation of Component 1 for the AI-Driven Multimodal Coconut Industry Risk Intelligence System.

The primary objective of C1 is to forecast the Export Volume and Export Value for five main coconut products (Coconut Oil, Virgin Coconut Oil (VCO), Desiccated Coconut (DC), Copra, and Fresh Nuts). The system uses advanced Time-Series and Machine Learning models to capture post-2022 macroeconomic shifts and provides an interactive dashboard for exporters and policymakers.

✨ Key Features
AI-Driven Forecasting: Predicts future export volumes and values for 5 coconut products.

Dual-Feature Dashboard: Toggle between volume (MT) and revenue (Rs. Million) in real-time.

What-If Scenario Simulator: An interactive UI for users to test macroeconomic shocks (Exchange Rate and Inflation) and see the immediate impact on forecasts.

Microservices Architecture: Fully decoupled Frontend, Backend, and ML Service for high scalability.

Zero Data Leakage: Strict chronological split (2018-2022 Train / 2023-2026 Test) ensures realistic evaluation.

🛠️ Technology Stack
Frontend: React.js, Tailwind CSS, Recharts

Backend: Node.js, Express.js

Machine Learning / API: Python, FastAPI, Statsmodels (SARIMAX), XGBoost, Scikit-learn

Database: PostgreSQL (via pg)

🧠 Machine Learning Models
The system evaluates three models per product to find the most accurate forecaster:

SARIMAX (Primary Model): Chosen for its ability to handle seasonality and exogenous variables (Inflation, Exchange Rate, Global Prices) with high extrapolation accuracy.

XGBoost (Baseline): Used to compare machine learning performance.

Hybrid Model: Combines SARIMAX and XGBoost residuals.

📊 Performance Metrics
SARIMAX MAPE: ~2.1% (Forecast Accuracy ~97.9%)

XGBoost MAPE: ~15.9%

📂 Folder Structure
text
c1-export-forecasting/
├── scripts/                 # Python ML Pipeline & API
│   ├── 01_data_prep.py      # Preprocessing & Feature Engineering
│   ├── 02_train_models.py   # Model Training (SARIMAX, XGBoost)
│   ├── 03_evaluate.py       # Evaluation & Graph Generation
│   ├── 04_api.py            # FastAPI ML Service (Forecast & What-If)
│   └── process_export_data.py 
├── data/                    # Processed CSV datasets (master_export_data.csv)
├── models/                  # Saved models (.pkl and .json)
├── outputs/                 # Evaluation metrics and forecast charts
└── server/                  # Node.js Backend
    ├── server.js            # Express API routes
    └── seed.js              # Database seeding script
🚀 How to Run Locally
This project requires 3 separate terminals to run the full microservices architecture.

1. Python ML Service (Terminal 1)
bash
cd ml-service/c1-export-forecasting
python scripts/04_api.py
# Runs on http://localhost:8000
2. Node.js Backend (Terminal 2)
bash
cd server
node server.js
# Runs on http://localhost:5000
3. React Frontend (Terminal 3)
bash
cd client
npm run dev
# Runs on http://localhost:5173
🔗 API Endpoints (Node.js Backend)
Method	Endpoint	Description
GET	/api/history/:product	Fetches historical export data from PostgreSQL
GET	/api/forecast/:product?months=6	Calls the Python ML API to get future forecasts
POST	/api/what-if	Passes user-adjusted macroeconomic variables to the ML simulator
🗄️ Database Schema (PostgreSQL)
historical_export_data: Stores date, product, volume, value, and macro variables.

export_forecasts: Stores AI-generated forecasts for audit and history.
