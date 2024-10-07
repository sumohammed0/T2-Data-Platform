# How to run: python upload_to_SQLite.py <path_to_csv_file> <database_name> <table_name>
# Ex: python upload_to_SQLite.py ../../5g_core_data.csv demo.db fiveg_data

import sqlite3
import pandas as pd
import argparse

# Set up command-line argument parsing
parser = argparse.ArgumentParser(description="Upload CSV to SQLite Database")

# Add arguments for file name, database name, and table name
parser.add_argument('csv_file', type=str, help="Path to the CSV file to be uploaded")
parser.add_argument('database_name', type=str, help="Name of the SQLite database file")
parser.add_argument('table_name', type=str, help="Name of the table to store the data")

# Parse the arguments
args = parser.parse_args()

# Load data file
df = pd.read_csv(args.csv_file)

# Data Clean Up: Strip whitespace from column names
df.columns = df.columns.str.strip()

# Create/connect to SQLite database
connection = sqlite3.connect(args.database_name)

# Load data file to SQLite table (if_exists='replace' will replace the table if it exists)
df.to_sql(args.table_name, connection, if_exists='replace', index=False)

# Close connection
connection.close()

print(f"Data from {args.csv_file} has been successfully uploaded to the '{args.table_name}' table in {args.database_name}")
