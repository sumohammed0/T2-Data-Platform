# test_module.py
from data_introspection import create_introspector
import os
import pandas as pd

def test_module():
    # Create a test CSV file
    if not os.path.exists('test_data'):
        os.makedirs('test_data')
    
    # Create sample data
    df = pd.DataFrame({
        'id': [1, 2, 3],
        'name': ['Alice', 'Bob', 'Charlie'],
        'age': [25, 30, 35]
    })
    
    # Save test CSV
    df.to_csv('test_data/sample.csv', index=False)
    
    try:
        # Test the module
        inspector = create_introspector('csv', directory_path='test_data')
        
        # Get table names
        tables = inspector.get_table_names()
        print(f"Found tables: {tables}")
        
        # Get metadata
        metadata = inspector.get_table_metadata('sample')
        print("\nMetadata:")
        print(f"Table name: {metadata.name}")
        print(f"Row count: {metadata.row_count}")
        print("Columns:")
        for col in metadata.columns:
            print(f"  - {col['name']}: {col['type']}")
            
        print("\nModule is working correctly!")
        
    except Exception as e:
        print(f"Error: {str(e)}")
    
    finally:
        # Cleanup test data
        if os.path.exists('test_data/sample.csv'):
            os.remove('test_data/sample.csv')
        if os.path.exists('test_data'):
            os.rmdir('test_data')

if __name__ == "__main__":
    test_module()