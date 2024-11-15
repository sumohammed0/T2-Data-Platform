# test_interactive.py
from data_introspection import create_introspector

# Create inspector
inspector = create_introspector('csv', directory_path='/Users/faris/t2_data_plat/T2-Data-Platform/my-project/backend/airbytedataupload')  # adjust path

# Get available tables (CSV files)
print(inspector.get_table_names())

# Get metadata for yspecific file (without .csv extension)
metadata = inspector.get_table_metadata('crime_data')

# Print the metadata
print(f"\nTable: {metadata.name}")
print(f"Rows: {metadata.row_count}")
print("\nColumns:")
for col in metadata.columns:
    print(f"  - {col['name']}: {col['type']}")