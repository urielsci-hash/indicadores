import pandas as pd
import os
import glob

files = glob.glob('Indicadores/**/*.xlsx', recursive=True)
for file in files:
    print(f"\n--- Analyzing {file} ---")
    try:
        xls = pd.ExcelFile(file)
        for sheet_name in xls.sheet_names:
            print(f"Sheet: {sheet_name}")
            df = pd.read_excel(xls, sheet_name)
            print("Columns:", df.columns.tolist())
            print("First few rows:")
            print(df.head(3).to_string())
    except Exception as e:
        print(f"Error: {e}")
