import sqlite3
import csv
import sys

def create_database(db_name):
    """Create a new SQLite database or connect to an existing one."""
    conn = sqlite3.connect(db_name)
    return conn

def detect_schema(csv_file):
    """Detect the schema of the CSV file based on the header and first row of data."""
    with open(csv_file, 'r') as file:
        csv_reader = csv.reader(file)
        headers = next(csv_reader)  # Read the header row
        first_row = next(csv_reader)  # Read the first data row
        
        schema = []
        for header, value in zip(headers, first_row):
            # Determine the data type for each column
            if value.isdigit():
                schema.append(f"{header} INTEGER")
            elif value.replace('.', '').isdigit():
                schema.append(f"{header} REAL")
            else:
                schema.append(f"{header} TEXT")
    
    return schema

def create_table(conn, table_name, schema):
    """Create a new table in the database with the detected schema."""
    cursor = conn.cursor()
    create_table_sql = f"CREATE TABLE IF NOT EXISTS {table_name} ({', '.join(schema)})"
    cursor.execute(create_table_sql)
    conn.commit()

def import_csv(conn, table_name, csv_file):
    """Import data from the CSV file into the SQLite table."""
    cursor = conn.cursor()
    with open(csv_file, 'r') as file:
        csv_reader = csv.reader(file)
        headers = next(csv_reader)  # Read the header row
        # Prepare the SQL insert statement
        insert_sql = f"INSERT INTO {table_name} ({','.join(headers)}) VALUES ({','.join(['?' for _ in headers])})"
        # Insert all rows from the CSV file
        cursor.executemany(insert_sql, csv_reader)
    conn.commit()

def main(db_name, table_name, csv_file):
    """Main function to orchestrate the database creation and data import process."""
    # Create or connect to the database
    conn = create_database(db_name)
    
    # Detect the schema from the CSV file
    schema = detect_schema(csv_file)
    
    # Create the table with the detected schema
    create_table(conn, table_name, schema)
    
    # Import the CSV data into the table
    import_csv(conn, table_name, csv_file)
    
    print(f"Data imported successfully into {table_name} table in {db_name} database.")
    conn.close()

if __name__ == "__main__":
    # Replace these with your actual file names and desired table name
    db_name = "my_database.db"  # Name of the SQLite database file
    table_name = "my_table"     # Name of the table to create in the database
    csv_file = "data.csv"       # Name of your CSV file
    
    # Run the main function
    main(db_name, table_name, csv_file)