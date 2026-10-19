import pandas as pd
import os

def create_master_dataset():
    print("📦 Merging all datasets into Master File...")
    
    processed_dir = 'data/processed/'
    
    # 1. හැම ෆයිල් එකක්ම Load කරගන්නවා
    try:
        df_export = pd.read_csv(f'{processed_dir}export_data_monthly.csv')
        df_ncpi = pd.read_csv(f'{processed_dir}ncpi_final_monthly.csv')
        df_exchange = pd.read_csv(f'{processed_dir}exchange_rate_monthly.csv')
        df_global = pd.read_csv(f'{processed_dir}wb_global_prices.csv')
    except FileNotFoundError as e:
        print(f"❌ Error: {e}")
        print("⚠️ Make sure all 4 processed CSVs exist in data/processed/")
        return

    # 2. Date තීරුව Datetime format එකට හරවනවා
    for df in [df_export, df_ncpi, df_exchange, df_global]:
        df['Date'] = pd.to_datetime(df['Date'])

    # 3. Export Data එක්ක NCPI එකතු කරනවා (Date එකෙන්)
    master_df = pd.merge(df_export, df_ncpi, on='Date', how='left')
    print(f"After NCPI merge: {len(master_df)} rows")

    # 4. Exchange Rate එකතු කරනවා
    master_df = pd.merge(master_df, df_exchange, on='Date', how='left')
    print(f"After Exchange Rate merge: {len(master_df)} rows")

    # 5. Global Prices එකතු කරනවා
    master_df = pd.merge(master_df, df_global, on='Date', how='left')
    print(f"After Global Prices merge: {len(master_df)} rows")

    # 6. අතුරුදහන් වෙච්ච දත්ත (NaN) ටිකක් තියෙනවා නම්, ඒවා ඉස්සරහට ගෙනියන ක්‍රමයට (Forward Fill) පුරවනවා
    # (මොකද Global Prices වගේ දත්ත 2024න් පස්සේ නැති වෙන්න පුළුවන්)
    master_df = master_df.ffill()
    
    # තවමත් මුල ඉඳන්ම නැති ඒවා 0 වලින් පුරවනවා
    master_df = master_df.fillna(0)

    # 7. අලුත් Features ටිකක් හදනවා
    master_df['Year'] = master_df['Date'].dt.year
    master_df['Month'] = master_df['Date'].dt.month
    master_df['Quarter'] = master_df['Date'].dt.quarter

    # 8. Save කරනවා
    output_path = f'{processed_dir}master_export_data.csv'
    master_df.to_csv(output_path, index=False)
    
    print(f"\n✅ Success! Master Dataset saved to: {output_path}")
    print(f"Total rows: {len(master_df)}")
    print("\n--- Columns in Master Dataset ---")
    print(master_df.columns.tolist())
    
    print("\n--- Sample Data (First 3 rows) ---")
    print(master_df.head(3).to_string(index=False))

if __name__ == "__main__":
    create_master_dataset()