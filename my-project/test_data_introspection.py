# test_data_introspection.py
import os
import pandas as pd
import sqlite3
from data_introspection import create_introspector

class TestDataSources:
    def __init__(self):
        # Test data
        self.test_data = {
            'users': pd.DataFrame({
                'id': [1, 2, 3],
                'name': ['Alice', 'Bob', 'Charlie'],
                'age': [25, 30, 35]
            }),
            'products': pd.DataFrame({
                'product_id': [1, 2, 3],
                'name': ['Apple', 'Banana', 'Orange'],
                'price': [1.0, 0.5, 0.75]
            })
        }
        
        # Paths
        self.csv_dir = 'test_data/csv'
        self.sqlite_path = 'test_data/test.db'

    def setup(self):
        """Set up test data sources"""
        self._setup_csv()
        self._setup_sqlite()

    def cleanup(self):
        """Clean up test data sources"""
        self._cleanup_csv()
        self._cleanup_sqlite()

    def _setup_csv(self):
        """Create CSV test files"""
        os.makedirs(self.csv_dir, exist_ok=True)
        for table_name, df in self.test_data.items():
            df.to_csv(f'{self.csv_dir}/{table_name}.csv', index=False)

    def _setup_sqlite(self):
        """Create SQLite test database"""
        os.makedirs(os.path.dirname(self.sqlite_path), exist_ok=True)
        conn = sqlite3.connect(self.sqlite_path)
        for table_name, df in self.test_data.items():
            df.to_sql(table_name, conn, index=False, if_exists='replace')
        conn.close()

    def _cleanup_csv(self):
        """Remove CSV test files"""
        if os.path.exists(self.csv_dir):
            for file in os.listdir(self.csv_dir):
                os.remove(os.path.join(self.csv_dir, file))
            os.rmdir(self.csv_dir)
            if os.path.exists('test_data'):
                try:
                    os.rmdir('test_data')
                except OSError:
                    pass  # Directory not empty (SQLite file might still be there)

    def _cleanup_sqlite(self):
        """Remove SQLite test database"""
        if os.path.exists(self.sqlite_path):
            os.remove(self.sqlite_path)
            if os.path.exists('test_data'):
                try:
                    os.rmdir('test_data')
                except OSError:
                    pass  # Directory not empty (might have other files)

    def test_csv_introspector(self):
        """Test CSV introspector"""
        print("\nTesting CSV Introspector...")
        try:
            inspector = create_introspector('csv', directory_path=self.csv_dir)
            
            # Test get_table_names
            tables = inspector.get_table_names()
            print(f"Found tables: {tables}")
            assert set(tables) == set(['users', 'products']), "Unexpected tables"
            
            # Test get_table_metadata
            for table in tables:
                metadata = inspector.get_table_metadata(table)
                print(f"\nTable: {metadata.name}")
                print(f"Rows: {metadata.row_count}")
                print("Columns:")
                for col in metadata.columns:
                    print(f"  - {col['name']}: {col['type']}")
                
                # Verify row count
                assert metadata.row_count == len(self.test_data[table]), "Incorrect row count"
            
            print("CSV tests passed successfully!")
            return True
            
        except Exception as e:
            print(f"CSV test failed: {str(e)}")
            return False

    def test_sqlite_introspector(self):
        """Test SQLite introspector"""
        print("\nTesting SQLite Introspector...")
        try:
            inspector = create_introspector('sqlite', db_path=self.sqlite_path)
            
            # Test get_table_names
            tables = inspector.get_table_names()
            print(f"Found tables: {tables}")
            assert set(tables) == set(['users', 'products']), "Unexpected tables"
            
            # Test get_table_metadata
            for table in tables:
                metadata = inspector.get_table_metadata(table)
                print(f"\nTable: {metadata.name}")
                print(f"Rows: {metadata.row_count}")
                print("Columns:")
                for col in metadata.columns:
                    print(f"  - {col['name']}: {col['type']}")
                
                # Verify row count
                assert metadata.row_count == len(self.test_data[table]), "Incorrect row count"
            
            print("SQLite tests passed successfully!")
            return True
            
        except Exception as e:
            print(f"SQLite test failed: {str(e)}")
            return False

def test_postgres_connection(credentials):
    """Test if PostgreSQL connection is possible"""
    try:
        import psycopg2
        conn = psycopg2.connect(
            dbname='postgres',  # Try connecting to default database
            user=credentials['user'],
            password=credentials['password'],
            host=credentials['host'],
            port=credentials.get('port', '5432')
        )
        conn.close()
        return True
    except Exception as e:
        print(f"PostgreSQL connection test failed: {str(e)}")
        return False

def main():
    tester = TestDataSources()
    
    try:
        print("Setting up test data sources...")
        tester.setup()
        
        print("\nRunning tests...")
        csv_success = tester.test_csv_introspector()
        sqlite_success = tester.test_sqlite_introspector()
        
        # Optional PostgreSQL test
        postgres_credentials = {
            'dbname': 'test_introspection',
            'user': input("\nEnter PostgreSQL username (or press Enter to skip PostgreSQL tests): ").strip()
        }
        
        if postgres_credentials['user']:
            postgres_credentials.update({
                'password': input("Enter PostgreSQL password: ").strip(),
                'host': input("Enter PostgreSQL host [localhost]: ").strip() or 'localhost',
                'port': input("Enter PostgreSQL port [5432]: ").strip() or '5432'
            })
            
            if test_postgres_connection(postgres_credentials):
                print("\nPostgreSQL connection successful!")
                # Import the full test suite and run PostgreSQL tests
                from test_all_sources import TestDataSources as FullTestSuite
                pg_tester = FullTestSuite()
                pg_tester.pg_credentials = postgres_credentials
                pg_tester._setup_postgres()
                pg_tester.test_postgres_introspector()
                pg_tester._cleanup_postgres()
        else:
            print("\nSkipping PostgreSQL tests...")
        
        # Summary
        print("\nTest Summary:")
        print(f"CSV Tests: {'Passed' if csv_success else 'Failed'}")
        print(f"SQLite Tests: {'Passed' if sqlite_success else 'Failed'}")
        
    except Exception as e:
        print(f"\nTest suite failed: {str(e)}")
        
    finally:
        print("\nCleaning up test data...")
        tester.cleanup()

if __name__ == "__main__":
    main()