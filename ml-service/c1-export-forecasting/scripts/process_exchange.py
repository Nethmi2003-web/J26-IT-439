import pandas as pd
import os

def process_exchange_rate():
    # ඔයා දැන් හදපු හරි නම මෙතන දාලා තියෙනවා
    file_path = 'data/raw/exchange_rate.csv'
    
    if not os.path.exists(file_path):
        print(f"❌ File not found: {file_path}")
        return
        
    print(f"📦 Processing: {file_path}")
    
    try:
        # CSV ෆයිල් එක කියවනවා
        df = pd.read_csv(file_path)
    except Exception as e:
        print(f"❌ Error reading file: {e}")
        return
        
    # තීරු නම් වල තියෙන හිස් ඉඩ අයින් කරනවා
    df.columns = [str(c).strip() for c in df.columns]
    
    # 'Date' සහ 'Rate' වගේ තීරු හොයාගන්නවා
    date_col = next((c for c in df.columns if 'date' in c.lower()), None)
    rate_col = next((c for c in df.columns if 'rate' in c.lower()), None)
    
    if not date_col or not rate_col:
        print(f"❌ 'Date' හෝ 'Rate' තීරු හොයාගන්න බැරි වුණා. මේ ෆයිල් එකේ තියෙන තීරු: {df.columns.tolist()}")
        return
        
    # අපිට ඕන තීරු 2 විතරක් ගන්නවා
    df = df[[date_col, rate_col]]
    df.columns = ['Date', 'Exchange Rate']
    
    # දින වල හැඩය හදනවා
    df['Date'] = pd.to_datetime(df['Date'], errors='coerce')
    df = df.dropna(subset=['Date'])
    
    # අංක වලට හරවනවා
    df['Exchange Rate'] = pd.to_numeric(df['Exchange Rate'], errors='coerce')
    
    # Daily සිට Monthly සාමාන්‍යයට හරවනවා
    df.set_index('Date', inplace=True)
    df_monthly = df.resample('MS').mean().reset_index()
    df_monthly.columns = ['Date', 'LKR_USD']
    
    # 2014 සිට තියෙන දත්ත විතරක් ගන්නවා
    df_monthly = df_monthly[df_monthly['Date'] >= '2014-01-01']
    
    # Save කරනවා
    os.makedirs('data/processed', exist_ok=True)
    output_path = 'data/processed/exchange_rate_monthly.csv'
    df_monthly.to_csv(output_path, index=False)
    
    print(f"\n✅ Success! Saved to: {output_path}")
    print(f"Total months: {len(df_monthly)}")
    print(df_monthly.tail(5).to_string(index=False))

if __name__ == "__main__":
    process_exchange_rate()