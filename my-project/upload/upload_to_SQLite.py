import sqlite3
import pandas as pd

#Load data file 
df = pd.read_csv('5g_core_data.csv')

#Data Clean Up
df.columns = df.columns.str.strip()

#Create/connect to a SQLite database
connection = sqlite3.connect('demo.db')

#Load data file to SQLite
#fail (will fail if file exists);replace;append
df.to_sql('fiveg_data', connection, if_exists= 'replace', index=False)

#Close connectiton
connection.close()