import pandas as pd
import os

def process_wb_data():
    file_path = 'data/raw/CMO-Historical-Data-Monthly.xlsx'
    
    if not os.path.exists(file_path):
        print(f"❌ File not found: {file_path}")
        return
        
    print("📦 Processing World Bank Data...")
    
    # World Bank Excel එකේ "Monthly Prices" කියන sheet එකේ දත්ත තියෙන්නේ පේළි 4කට පස්සේ
    # ඒ නිසා අපි skiprows=4 කරනවා
    df = pd.read_excel(file_path, sheet_name='Monthly Prices', skiprows=4)
    
    # පළමු තීරුවේ නම වෙනස් වෙන්න පුළුවන්, ඒ නිසා අපි ඒක 'Date' කියලා rename කරගන්නවා
    df.rename(columns={df.columns[0]: 'Date'}, inplace=True)
    
    # අපිට ඕන තීරු ටික විතරක් තෝරගන්නවා (Coconut oil සහ Palm oil)
    # සමහරවිට තීරුවල නම් වල පොඩි වෙනස්කම් තියෙන්න පුළුවන්, ඒ නිසා අපි නම් ටික හොයලා ගන්නවා
    cols_to_keep = ['Date']
    
    for col in df.columns:
        if isinstance(col, str):
            if 'Coconut oil' in col:
                cols_to_keep.append(col)
            elif 'Palm oil' in col:
                cols_to_keep.append(col)
                
    if len(cols_to_keep) < 3:
        print("⚠️ Could not find Coconut or Palm oil columns. Please check the Excel file.")
        print("Available columns:", df.columns[:10].tolist()) # පළමු තීරු 10 පෙන්නනවා
        return
        
    df = df[cols_to_keep]
    
    # තීරු වල නම් ලස්සනට වෙනස් කරගන්නවා
    df.columns = ['Date', 'Global_Coconut_Price', 'Global_Palm_Price']
    
    # 'Date' තීරුවේ තියෙන්නේ '1960M01' වගේ ඒවා. අපි ඒක 'YYYY-MM-01' විදියට හරවගන්නවා
    df = df[df['Date'].astype(str).str.contains('M')] # 'M' අකුර තියෙන පේළි විතරක් ගන්නවා
    df['Date'] = df['Date'].astype(str).str.replace('M', '-')
    df['Date'] = pd.to_datetime(df['Date'], format='%Y-%m', errors='coerce')
    
    # 2014 සිට තියෙන දත්ත විතරක් ගන්නවා
    df = df[df['Date'] >= '2014-01-01'].dropna(subset=['Date'])
    
    # දත්ත අංක (Float) වලට හරවනවා
    df['Global_Coconut_Price'] = pd.to_numeric(df['Global_Coconut_Price'], errors='coerce')
    df['Global_Palm_Price'] = pd.to_numeric(df['Global_Palm_Price'], errors='coerce')
    
    df = df.sort_values('Date').reset_index(drop=True)
    
    # Save කරනවා
    output_path = 'data/processed/wb_global_prices.csv'
    df.to_csv(output_path, index=False)
    
    print(f"✅ Success! Saved to: {output_path}")
    print(f"Total rows: {len(df)}")
    print(df.tail(3).to_string(index=False))

if __name__ == "__main__":
    process_wb_data()