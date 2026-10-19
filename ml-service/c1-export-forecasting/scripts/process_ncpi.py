import re
import pandas as pd
import os

def parse_ncpi_data(file_path):
    if not os.path.exists(file_path):
        print(f"❌ File not found: {file_path}")
        return None
        
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    data = []
    current_year = None
    months = ['January', 'February', 'March', 'April', 'May', 'June', 
              'July', 'August', 'September', 'October', 'November', 'December']

    for line in lines:
        line = line.strip()
        year_match = re.match(r'^(20\d{2})', line)
        if year_match:
            current_year = int(year_match.group(1))
            if len(line) == 4:
                continue
        
        if current_year:
            for month in months:
                if month in line:
                    match = re.search(month + r'\s+([\d.]+)', line)
                    if match:
                        ncpi_val = float(match.group(1))
                        data.append({
                            'Year': current_year,
                            'Month': month,
                            'NCPI_Value': ncpi_val
                        })
                    break

    df = pd.DataFrame(data)
    if df.empty:
        return df
        
    month_map = {m: i+1 for i, m in enumerate(months)}
    df['Month_Num'] = df['Month'].map(month_map)
    df['Date'] = pd.to_datetime(df['Year'].astype(str) + '-' + df['Month_Num'].astype(str) + '-01')
    return df

def main():
    print("📦 Parsing NCPI Data...")
    
    # 1. දත්ත දෙකම කියවගන්නවා
    df_old = parse_ncpi_data('data/raw/ncpi_2013_raw.txt')
    df_new = parse_ncpi_data('data/raw/ncpi_2022_raw.txt')

    if df_old is None or df_new is None:
        print("⚠️ Please check if both .txt files are inside data/raw/")
        return

    print(f"Old Data Rows: {len(df_old)}, New Data Rows: {len(df_new)}")

    # 2. 2022 අවුරුද්දේ දත්ත දෙකේ අනුපාතය ගන්නවා (Base එක වෙනස් කරන්න)
    old_2022 = df_old[df_old['Year'] == 2022]['NCPI_Value'].mean()
    new_2022 = df_new[df_new['Year'] == 2022]['NCPI_Value'].mean()
    
    if pd.isna(old_2022) or pd.isna(new_2022):
        print("⚠️ Could not find 2022 data to splice bases. Check your text files.")
        return

    conversion_factor = new_2022 / old_2022
    print(f"🔄 Base Conversion Factor (2021 Base / 2013 Base): {conversion_factor:.4f}")

    # 3. 2022 ට කලින් දත්ත අලුත් Base එකට හරවනවා
    pre_2022 = df_old[df_old['Year'] < 2022].copy()
    pre_2022['NCPI_Final'] = pre_2022['NCPI_Value'] * conversion_factor

    # 4. 2022 සහ ඊට පස්සේ දත්ත
    post_2022 = df_new[df_new['Year'] >= 2022].copy()
    post_2022['NCPI_Final'] = post_2022['NCPI_Value']

    # 5. දෙකම එකට එකතු කරනවා
    final_df = pd.concat([
        pre_2022[['Date', 'Year', 'Month', 'NCPI_Final']], 
        post_2022[['Date', 'Year', 'Month', 'NCPI_Final']]
    ])
    
    final_df = final_df.sort_values('Date').reset_index(drop=True)
    
    # 6. Save කරනවා
    os.makedirs('data/processed', exist_ok=True)
    output_path = 'data/processed/ncpi_final_monthly.csv'
    final_df.to_csv(output_path, index=False)
    
    print(f"\n✅ Success! Saved to: {output_path}")
    print(f"Total rows: {len(final_df)}")
    print(f"Date range: {final_df['Date'].min().strftime('%Y-%m')} to {final_df['Date'].max().strftime('%Y-%m')}")

# මේක තමයි අන්තිමට තියෙන්න ඕන කොටස. මේක නැතුව කෝඩ් එක run වෙන්නේ නැහැ.
if __name__ == "__main__":
    main()