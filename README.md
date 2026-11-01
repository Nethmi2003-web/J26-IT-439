C4 — WCLWD Spatial Risk Prediction Model
Spatial XGBoost model that predicts Weligama Coconut Leaf Wilt Disease (WCLWD) risk per plot.
Performance
Metric	Value
Spatial XGBoost AUC	0.9426
Non-spatial baseline AUC	0.8842
Improvement	+6.61%
F1 (spatial)	0.8634
Precision	0.9130
Recall	0.8190
Top features: neighbour_risk (0.59), area_deg2 (0.10), longitude (0.08), distance_to_infected (0.08).
Hotspot Detection
DBSCAN: 10 clusters, 78 plots
Moran's I: 0.3315, p = 0.001 (significant spatial clustering)
Folder Structure
    c4-handoff/
├── models/xgboost_v3_final.json          # Trained model
├── data/
│   ├── master_table_v3.csv               # 26,040 rows (DB seed)
│   ├── hotspot_clusters_v3.csv           # 10 hotspots
│   └── zone_risk_v3.csv                  # Zone summary
├── outputs/
│   ├── model_info.json                   # Features, AUC, importance
│   ├── results_v3.json                   # Full results
│   └── wcld_risk_map.html                # Interactive map
├── predict.py                             # Reference code
├── requirements.txt
└── README.md

Quick Start
    pip install -r requirements.txt
python predict.py

Expected output:
    {
"risk_probability": 0.9494,
"risk_level": "Critical",
"model_auc": 0.9426
}

Generate Model Charts
From the project root, run:
    python scripts/generate_c4_graphs.py

This creates `c4\_confusion\_matrix.png`, `c4\_feature\_importance.png`, and
`c4\_roc\_curve.png` in `c4-spatial/outputs/`. The charts use the 2023-2024 test
records from `data/master\_table\_v3.csv` and the trained model in `models/`.
Run the API
From the project root, start the FastAPI server with:
    .\backend\.venv\Scripts\python.exe -m uvicorn backend.app:app --reload --host 127.0.0.1 --port 8080

Open `http://127.0.0.1:8080/docs` for interactive API documentation. Check
`GET /health` for server and model status, or send a `POST /predict` request
using the API input fields above.
API Input Format
Feature	Type	Description
wind_speed	float	Wind speed at 2m (m/s)
wind_direction	float	Wind direction (degrees)
latitude	float	Plot latitude
longitude	float	Plot longitude
area_deg2	float	Plot area (square degrees)
month	int	Month (1-12)
neighbour_risk	float	Fraction of neighbours infected (prev month)
neighbour_count	int	Number of neighbours (default 5)
distance_to_infected	float	Distance to nearest infected plot (deg)
ndvi	float (opt)	NDVI value (0-1)
ndvi_change	float (opt)	NDVI change from previous month
Risk Levels
Level	Range
Low	prob < 0.25
Medium	0.25 <= prob < 0.5
High	0.5 <= prob < 0.75
Critical	prob >= 0.75
Database Integration
Master table (master_table_v3.csv — 26,040 rows):
    plot_id, date, year, month
disease_status, newly_infected, prev_status
latitude, longitude, zone, climatic_zone, source
neighbour_risk, neighbour_count, distance_to_infected
area_deg2, wind_speed, wind_direction
ndvi, ndvi_change

Hotspots (hotspot_clusters_v3.csv): plot_id, latitude, longitude, cluster
Backend Integration
Load model at server start (see predict.py)
Predict endpoint — call predict_risk() or replicate in FastAPI/Express
CORS — enable for frontend origin
Latency — < 50ms per prediction
Batch — pass DataFrame for multiple predictions
Limitations
Synthetic disease data — based on published WCLWD patterns (not real CRI records)
Single AEZ zone (DL1b) — all 310 plots in one zone
Time-based split — 2018-22 train, 2023-24 test
Can be retrained with real CRI data without API changes
Contact
For model questions, contact the C4 data/model owner.
