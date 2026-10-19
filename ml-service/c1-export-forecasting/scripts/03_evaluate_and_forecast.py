import pandas as pd
import numpy as np
import os
import joblib
import xgboost as xgb
import matplotlib.pyplot as plt
from sklearn.metrics import mean_absolute_error, mean_squared_error

import warnings
warnings.filterwarnings('ignore')

# Metrics ගණනය කරන function එක
def calculate_metrics(y_true, y_pred):
    mae = mean_absolute_error(y_true, y_pred)
    rmse = np.sqrt(mean_squared_error(y_true, y_pred))
    # MAPE (Divide by zero වැළැක්වීමට)
    y_true_safe = np.where(y_true == 0, 1, y_true)
    mape = np.mean(np.abs((y_true - y_pred) / y_true_safe)) * 100
    return mae, rmse, mape

def evaluate_models():
    print("📦 Loading Master Data...")
    df = pd.read_csv('data/processed/master_export_data.csv')
    df['Date'] = pd.to_datetime(df['Date'])
    
    target_col = 'Volume_MT'
    exog_cols = ['NCPI_Final', 'LKR_USD', 'Global_Coconut_Price', 'Global_Palm_Price']
    products = df['Product'].unique()
    
    os.makedirs('outputs', exist_ok=True)
    all_metrics = []
    
    for product in products:
        print(f"\n🔄 Evaluating: {product}")
        
        prod_df = df[df['Product'] == product].sort_values('Date').reset_index(drop=True)
        prod_df.set_index('Date', inplace=True)
        
        # Train / Test Split (Pre-2022 & Post-2022 පෙන්නන්න 2023 ඉඳන් Test කරමු)
        train = prod_df[prod_df.index < '2023-01-01']
        test = prod_df[prod_df.index >= '2023-01-01']
        
        # 1. SARIMAX Predictions
        sarimax_model = joblib.load(f"models/{product.replace(' ', '_')}_sarimax.pkl")
        sarimax_pred = sarimax_model.predict(start=test.index[0], end=test.index[-1], exog=test[exog_cols])
        
        # 2. XGBoost Predictions
        xgb_model = xgb.XGBRegressor()
        xgb_model.load_model(f"models/{product.replace(' ', '_')}_xgboost.json")
        
        # XGBoost සඳහා Lag features සකස් කිරීම (සරලවම)
        test_xgb = test.copy()
        test_xgb['Lag_1'] = train[target_col].iloc[-1] # Dummy logic for test lag
        test_xgb['Lag_3'] = train[target_col].iloc[-3]
        test_xgb['Lag_12'] = train[target_col].iloc[-12]
        test_xgb['Month'] = test_xgb.index.month
        xgb_features = exog_cols + ['Lag_1', 'Lag_3', 'Lag_12', 'Month']
        xgb_pred = xgb_model.predict(test_xgb[xgb_features])
        
        # 3. Hybrid Model (SARIMAX + XGBoost Residuals)
        # සරලවම කියනවා නම්: Hybrid = (SARIMAX Prediction + XGBoost Prediction) / 2 
        # (මේක පහසුම සහ ප්‍රායෝගිකම ක්‍රමයයි 4th year project එකකට)
        hybrid_pred = (sarimax_pred.values + xgb_pred) / 2
        
        # Metrics ගණනය කිරීම
        y_true = test[target_col].values
        sarimax_metrics = calculate_metrics(y_true, sarimax_pred.values)
        xgb_metrics = calculate_metrics(y_true, xgb_pred)
        hybrid_metrics = calculate_metrics(y_true, hybrid_pred)
        
        all_metrics.append({
            'Product': product,
            'SARIMAX_MAE': sarimax_metrics[0], 'SARIMAX_RMSE': sarimax_metrics[1], 'SARIMAX_MAPE': sarimax_metrics[2],
            'XGBoost_MAE': xgb_metrics[0], 'XGBoost_RMSE': xgb_metrics[1], 'XGBoost_MAPE': xgb_metrics[2],
            'Hybrid_MAE': hybrid_metrics[0], 'Hybrid_RMSE': hybrid_metrics[1], 'Hybrid_MAPE': hybrid_metrics[2]
        })
        
        # ==========================================
        # Viva Panel එකට Graphs/Charts හදනවා
        # ==========================================
        plt.figure(figsize=(12, 6))
        
        # අතීත දත්ත (Train)
        plt.plot(train.index, train[target_col], label='Historical Data (Pre-2022)', color='blue')
        
        # සැබෑ Test දත්ත (Actual)
        plt.plot(test.index, y_true, label='Actual Data (Post-2022)', color='black', linewidth=2)
        
        # Forecast කරපු දත්ත
        plt.plot(test.index, sarimax_pred.values, label='SARIMAX Forecast', color='orange', linestyle='--')
        plt.plot(test.index, xgb_pred, label='XGBoost Forecast', color='green', linestyle='-.')
        plt.plot(test.index, hybrid_pred, label='Hybrid Forecast', color='red', linewidth=2)
        
        plt.title(f'{product} Export Volume - Forecast Comparison (2023-2025)', fontsize=14, fontweight='bold')
        plt.xlabel('Date')
        plt.ylabel('Volume (MT)')
        plt.legend()
        plt.grid(True, alpha=0.3)
        plt.tight_layout()
        
        # Chart එක Save කරනවා
        chart_path = f'outputs/{product.replace(" ", "_")}_forecast_chart.png'
        plt.savefig(chart_path, dpi=300)
        plt.close()
        print(f"  📊 Saved Chart: {chart_path}")

    # හැම එකේම Metrics ටේබල් එකක් විදියට Save කරනවා
    metrics_df = pd.DataFrame(all_metrics)
    metrics_df.to_csv('outputs/model_evaluation_metrics.csv', index=False)
    print(f"\n✅ All Evaluations Complete! Metrics saved to: outputs/model_evaluation_metrics.csv")
    print(metrics_df.to_string(index=False))

if __name__ == "__main__":
    evaluate_models()