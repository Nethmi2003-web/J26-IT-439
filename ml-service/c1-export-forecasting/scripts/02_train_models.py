import pandas as pd
import numpy as np
import os
import joblib
import warnings
from statsmodels.tsa.statespace.sarimax import SARIMAX
import xgboost as xgb

warnings.filterwarnings('ignore')

def train_models():
    print("📦 Loading Master Data...")
    df = pd.read_csv('data/processed/master_export_data.csv')
    df['Date'] = pd.to_datetime(df['Date'])
    
    # අපි මේකෙදි අපනයන 'Volume' එක Forecast කරන්න තමයි Model හදන්නේ
    target_col = 'Volume_MT'
    exog_cols = ['NCPI_Final', 'LKR_USD', 'Global_Coconut_Price', 'Global_Palm_Price']
    
    products = df['Product'].unique()
    os.makedirs('models', exist_ok=True)
    
    for product in products:
        print(f"\n🔄 Training Models for: {product}")
        
        # අදාළ Product එකේ දත්ත වෙන් කරගන්නවා
        prod_df = df[df['Product'] == product].sort_values('Date').reset_index(drop=True)
        prod_df.set_index('Date', inplace=True)
        
        y = prod_df[target_col]
        X = prod_df[exog_cols]
        
        # ==========================================
        # 1. SARIMAX Model Training
        # ==========================================
        print(f"  -> Training SARIMAX...")
        # (p,d,q) සහ (P,D,Q,s) - මේවා සාමාන්‍ය Time Series parameters
        sarimax_model = SARIMAX(y, exog=X, order=(1, 1, 1), seasonal_order=(1, 1, 1, 12))
        sarimax_res = sarimax_model.fit(disp=False)
        
        # Model එක Save කරනවා
        sarimax_filename = f"models/{product.replace(' ', '_')}_sarimax.pkl"
        joblib.dump(sarimax_res, sarimax_filename)
        print(f"     Saved: {sarimax_filename}")
        
        # ==========================================
        # 2. XGBoost Model Training
        # ==========================================
        print(f"  -> Training XGBoost...")
        
        # XGBoost එකට අතීත දත්ත (Lag features) ඕන නිසා ඒවා හදාගන්නවා
        xgb_df = prod_df.copy()
        xgb_df['Lag_1'] = xgb_df[target_col].shift(1)
        xgb_df['Lag_3'] = xgb_df[target_col].shift(3)
        xgb_df['Lag_12'] = xgb_df[target_col].shift(12)
        xgb_df['Month'] = xgb_df.index.month
        xgb_df = xgb_df.dropna() # මුල් පේළි කීපයේ lag නැති නිසා ඒවා අයින් කරනවා
        
        xgb_features = exog_cols + ['Lag_1', 'Lag_3', 'Lag_12', 'Month']
        
        X_xgb = xgb_df[xgb_features]
        y_xgb = xgb_df[target_col]
        
        xgb_model = xgb.XGBRegressor(n_estimators=100, learning_rate=0.1, max_depth=3, random_state=42)
        xgb_model.fit(X_xgb, y_xgb)
        
        xgb_filename = f"models/{product.replace(' ', '_')}_xgboost.json"
        xgb_model.save_model(xgb_filename)
        print(f"     Saved: {xgb_filename}")
        
    print("\n✅ All Models Trained and Saved Successfully!")
    print("📁 Check the 'models/' folder.")

if __name__ == "__main__":
    train_models()