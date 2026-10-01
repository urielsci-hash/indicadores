import pandas as pd
import json
import sys
import os

def to_float(val):
    if pd.isna(val):
        return None
    if isinstance(val, str):
        val = val.strip()
        if not val or val == '-' or val == 'NaN':
            return None
    try:
        return float(val)
    except:
        return None

def parse_perdas(file_path):
    df = pd.read_excel(file_path, sheet_name='PERDAS (TIPO)', header=None).dropna(how='all')
    months = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ']
    data = []

    start_row = 2
    while start_row < len(df):
        motivo = df.iloc[start_row, 4]
        if pd.isna(motivo) or str(motivo).strip() == 'MÊS':
            break

        row_data = {'description': str(motivo).strip(), 'values': {}}
        col_idx = 5
        for m in months:
            if col_idx < len(df.columns):
                val = df.iloc[start_row, col_idx]
                row_data['values'][m] = to_float(val)
            else:
                row_data['values'][m] = None
            col_idx += 1
        data.append(row_data)
        start_row += 1

    return data

def parse_pcp(file_path):
    df = pd.read_excel(file_path, sheet_name='2026', header=None).dropna(how='all').reset_index(drop=True)
    months = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ']
    data = []

    start_row = 2
    while start_row < len(df):
        desc = df.iloc[start_row, 4]
        if pd.isna(desc) or str(desc).strip() == 'MÊS' or str(desc).strip() == 'NaN' or 'AÇÃO REALIZADA' in str(desc):
            break

        row_data = {'description': str(desc).strip(), 'values': {}}
        col_idx = 5
        for m in months:
            if col_idx < len(df.columns):
                val = df.iloc[start_row, col_idx]
                row_data['values'][m] = to_float(val)
            else:
                row_data['values'][m] = None
            col_idx += 1
        data.append(row_data)
        start_row += 1

    return data

def parse_qualidade(file_path):
    df = pd.read_excel(file_path, sheet_name='2026', header=None).dropna(how='all').reset_index(drop=True)
    months = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ']
    data = []

    start_row = 2
    while start_row < len(df):
        desc = df.iloc[start_row, 3]
        if pd.isna(desc) or str(desc).strip() == 'MÊS' or str(desc).strip() == 'NaN' or 'AÇÃO REALIZADA' in str(desc):
            if 'AÇÃO REALIZADA' in str(desc):
                break
            start_row += 1
            continue

        row_data = {'description': str(desc).strip().replace('\n', ' '), 'values': {}}
        col_idx = 4
        for m in months:
            if col_idx < len(df.columns):
                val = df.iloc[start_row, col_idx]
                row_data['values'][m] = to_float(val)
            else:
                row_data['values'][m] = None
            col_idx += 1
        data.append(row_data)
        start_row += 1

    return data

def parse_manutencao(file_path):
    df = pd.read_excel(file_path, sheet_name='2026', header=None).dropna(how='all').reset_index(drop=True)
    months = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ']
    data = []

    start_row = 3 # index 3 in the printed reset dataframe is where PROGRAMADAS starts
    while start_row < len(df):
        desc = df.iloc[start_row, 4]
        if pd.isna(desc) or str(desc).strip() == 'MÊS' or str(desc).strip() == 'NaN' or 'AÇÃO REALIZADA' in str(desc) or 'MÊS' in str(df.iloc[start_row, 2]):
            break

        row_data = {'description': str(desc).strip(), 'values': {}}
        col_idx = 5
        for m in months:
            if col_idx < len(df.columns):
                val = df.iloc[start_row, col_idx]
                row_data['values'][m] = to_float(val)
            else:
                row_data['values'][m] = None
            col_idx += 1
        data.append(row_data)
        start_row += 1

    return data

if __name__ == '__main__':
    if len(sys.argv) < 3:
        print(json.dumps({'error': 'Missing arguments. Usage: python parse_excel.py <type> <file_path>'}))
        sys.exit(1)

    graph_type = sys.argv[1]
    file_path = sys.argv[2]

    if not os.path.exists(file_path):
        print(json.dumps({'error': 'File not found'}))
        sys.exit(1)

    try:
        if graph_type == 'perdas':
            data = parse_perdas(file_path)
        elif graph_type == 'pcp':
            data = parse_pcp(file_path)
        elif graph_type == 'qualidade':
            data = parse_qualidade(file_path)
        elif graph_type == 'manutencao':
            data = parse_manutencao(file_path)
        else:
            print(json.dumps({'error': 'Unknown graph type'}))
            sys.exit(1)

        print(json.dumps({'success': True, 'data': data}))
    except Exception as e:
        print(json.dumps({'error': str(e)}))
        sys.exit(1)
