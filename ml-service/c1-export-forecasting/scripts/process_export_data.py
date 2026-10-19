import pandas as pd
import numpy as np
import os

def generate_disaggregated_data():
    print("📦 Processing Export Data (Temporal Disaggregation)...")
    
    # 1. අවුරුදු සහ මාස සකස් කරගැනීම
    years = range(2018, 2026)
    months = range(1, 13)
    
    # අපේ ප්‍රධාන නිෂ්පාදන 5
    products = ['Coconut Oil', 'VCO', 'DC', 'Copra', 'Fresh Nuts']
    
    # සමහර මාස වලට අපනයන වැඩි (Seasonality)
    # උදා: අප්‍රේල් සහ දෙසැම්බර් වලට වැඩි ඉල්ලුමක් තියෙනවා කියලා අපි හිතමු
    seasonal_weights = {1: 0.9, 2: 0.8, 3: 0.9, 4: 1.2, 5: 1.0, 6: 0.8, 
                        7: 0.7, 8: 0.8, 9: 1.0, 10: 1.1, 11: 1.2, 12: 1.6}
    
    records = []
    
    for product in products:
        # පසුගිය වාර්ෂික එකතුවට සමානව පොඩි Growth එකක් එකතු කරමු
        base_annual = 10000 # උදාහරණයක් විදියට
        if product == 'Coconut Oil': base_annual = 20000
        if product == 'VCO': base_annual = 15000
        if product == 'DC': base_annual = 30000
        if product == 'Copra': base_annual = 5000
        if product == 'Fresh Nuts': base_annual = 50000
        
        for year in years:
            # ආර්ථික අර්බුදය නිසා 2022 අවුරුද්දේ අපනයන ටිකක් වැටෙනවා කියලා අපි හිතමු
            year_factor = 1.0
            if year == 2022: year_factor = 0.85
            if year >= 2023: year_factor = 1.05
            
            current_annual_total = base_annual * year_factor
            
            # වාර්ෂික එකතුව මාස 12ට බෙදීම (Seasonal Weight පාවිච්චි කරලා)
            total_weight = sum(seasonal_weights.values())
            
            for month in months:
                # Volume එක ගණනය කිරීම (MT)
                monthly_volume = (current_annual_total * (seasonal_weights[month] / total_weight))
                
                # Value එක ගණනය කිරීම (Rs. Mln) - Unit Price එකක් එකතු කරලා
                unit_price = 250 # 1 MT එකක මිල
                if product == 'VCO': unit_price = 450
                if product == 'Fresh Nuts': unit_price = 100
                
                monthly_value = monthly_volume * unit_price
                
                records.append({
                    'Date': f"{year}-{month:02d}-01",
                    'Product': product,
                    'Volume_MT': round(monthly_volume, 2),
                    'Value_RsMln': round(monthly_value, 2)
                })
    
    df = pd.DataFrame(records)
    df['Date'] = pd.to_datetime(df['Date'])
    df = df.sort_values(['Product', 'Date']).reset_index(drop=True)
    
    # Save
    os.makedirs('data/processed', exist_ok=True)
    output_path = 'data/processed/export_data_monthly.csv'
    df.to_csv(output_path, index=False)
    
    print(f"✅ Success! Saved to: {output_path}")
    print(f"Total rows: {len(df)}")
    print("\n--- Sample Data ---")
    print(df.head())

if __name__ == "__main__":
    generate_disaggregated_data()