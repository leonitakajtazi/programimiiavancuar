import sys
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

def load_csv(file_path):
    """Lexon CSV dhe kthen një DataFrame"""
    try:
        df = pd.read_csv(file_path)
        return df
    except Exception as e:
        print(f"Gabim gjatë leximit të skedarit: {e}")
        sys.exit(1)

def calculate_stats(df, column):
    """Llogarit statistikat bazë për një kolonë të caktuar"""
    if column not in df.columns:
        print(f"Kolona '{column}' nuk u gjet.")
        return
    
    data = df[column].dropna()
    mean = np.mean(data)
    median = np.median(data)
    mode = data.mode().values
    std_dev = np.std(data)
    
    print(f"Statistikat për '{column}':")
    print(f"  Mesatarja: {mean}")
    print(f"  Mediana: {median}")
    print(f"  Moda: {mode}")
    print(f"  Devijimi standard: {std_dev}")

def plot_histogram(df, column, bins=10):
    """Krijon histogram për një kolonë të dhënë"""
    if column not in df.columns:
        print(f"Kolona '{column}' nuk u gjet.")
        return
    
    data = df[column].dropna()
    plt.hist(data, bins=bins, edgecolor='black')
    plt.xlabel(column)
    plt.ylabel("Frekuenca")
    plt.title(f"Histogram për {column}")
    plt.show()

def calculate_correlation(df, col1, col2):
    """Gjen korrelacionin mes dy kolonave"""
    if col1 not in df.columns or col2 not in df.columns:
        print(f"Njëra ose të dyja kolonat '{col1}', '{col2}' nuk u gjetën.")
        return
    
    correlation = df[col1].corr(df[col2])
    print(f"Korrelacioni mes '{col1}' dhe '{col2}': {correlation}")

def detect_outliers(df, column, threshold=2.0):
    """Gjen outliers bazuar në devijimin standard"""
    if column not in df.columns:
        print(f"Kolona '{column}' nuk u gjet.")
        return
    
    data = df[column].dropna()
    mean = np.mean(data)
    std_dev = np.std(data)
    outliers = data[(data < mean - threshold * std_dev) | (data > mean + threshold * std_dev)]
    
    print(f"Vlerat jashtë normales për '{column}':")
    print(outliers.to_list())

def main():
    if len(sys.argv) < 3:
        print("Përdorimi: python mini-project.py <file.csv> <command> [opsione]")
        sys.exit(1)
    
    file_path = sys.argv[1]
    command = sys.argv[2]
    df = load_csv(file_path)
    
    if command == "stats" and len(sys.argv) == 4:
        calculate_stats(df, sys.argv[3])
    elif command == "histogram" and len(sys.argv) == 5:
        plot_histogram(df, sys.argv[3], int(sys.argv[4]))
    elif command == "correlation" and len(sys.argv) == 5:
        calculate_correlation(df, sys.argv[3], sys.argv[4])
    elif command == "outliers" and len(sys.argv) == 5:
        detect_outliers(df, sys.argv[3], float(sys.argv[4]))
    else:
        print("Komandë e panjohur ose argumente të pamjaftueshme.")
        sys.exit(1)

if __name__ == "__main__":
    main()