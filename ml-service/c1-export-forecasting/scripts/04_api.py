from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import joblib
import xgboost as xgb
import os
from datetime import datetime

app = FastAPI(title="C1 Export Forecasting API")

# React Frontend එකට සම්බන්ධ වෙන්න අවසර දීම (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Development එකට ඕන හැම එකකටම අවසර
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models Load කරගැනීම
MODELS_DIR = "models"
df = pd.read_csv('data/processed/master_export_data.csv')
df['Date'] = pd.to_datetime(df['Date'])

@app.get("/")
def read_root():
    return {"message": "C1 Export Forecasting API is running!"}

@app.get("/forecast/{product}")
def get_forecast(product: str, months: int = 3):
    # Product එකේ නම හරියටම තියෙනවද බලන්න
    formatted_product = product.replace("_", " ")
    product_data = df[df['Product'].str.lower() == formatted_product.lower()]
    
    if product_data.empty:
        raise HTTPException(status_code=404, detail="Product not found")
        
    try:
        # SARIMAX Model එක Load කරගන්නවා
        model_filename = f"{MODELS_DIR}/{formatted_product.replace(' ', '_')}_sarimax.pkl"
        model = joblib.load(model_filename)
        
        # අලුත් මාස කීපයකට අනාගත අගයන් හදන්න (සරලවම පසුගිය දත්ත පාවිච්චි කරලා)
        # මෙතනදී අපි උපකල්පනය කරනවා Exogenous variables (NCPI, Exchange rate) එකම තත්ත්වයේ තියෙනවා කියලා
        last_date = df['Date'].max()
        future_dates = pd.date_range(start=last_date + pd.DateOffset(months=1), periods=months, freq='MS')
        
        # අනාගත Exogenous දත්ත (අවසන් වරට තිබ්බ අගයම පාවිච්චි කරනවා)
        last_exog = product_data.iloc[-1][['NCPI_Final', 'LKR_USD', 'Global_Coconut_Price', 'Global_Palm_Price']].to_dict()
        future_exog = pd.DataFrame([last_exog] * months, index=future_dates)
        
        # Predict කිරීම
        forecast = model.predict(start=future_dates[0], end=future_dates[-1], exog=future_exog)
        
        # Result එක format කිරීම
        results = []
        for date, vol in zip(future_dates, forecast):
            results.append({
                "date": date.strftime("%Y-%m"),
                "predicted_volume": round(float(vol), 2)
            })
            
        return {
            "product": formatted_product,
            "model_used": "SARIMAX",
            "forecast": results
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)