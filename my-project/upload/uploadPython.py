import sqlite3
import pandas as pd

# Step 1: Connect to your SQLite database (it will create a database if it doesn't exist)
conn = sqlite3.connect('test.db')  # Adjust the path if necessary
cursor = conn.cursor()

# Step 2: Read your CSV file into a pandas DataFrame
csv_file = '5g_core_data.csv'  # Replace with the path to your CSV file
df = pd.read_csv(csv_file)

# Step 3: Create a table (adjust column types as needed)
cursor.execute('''
    CREATE TABLE IF NOT EXISTS network_data (
    datetime TEXT,
    session_id TEXT,
    user_equipment_id TEXT,
    amf_instance_id TEXT,
    smf_instance_id TEXT,
    upf_instance_id TEXT,
    number_of_active_bearers INTEGER,
    data_volume_uplink_mb REAL,
    data_volume_downlink_mb REAL,
    latency_ms REAL,
    packet_loss_rate REAL,
    connection_failures INTEGER,
    handover_attempts INTEGER,
    handover_successes INTEGER,
    signaling_traffic_volume_kb REAL
);

''')

# Step 4: Insert the DataFrame data into the SQLite database
df.to_sql('employees', conn, if_exists='append', index=False)

# Step 5: Commit and close the connection
conn.commit()
conn.close()

print("CSV data uploaded successfully.")
