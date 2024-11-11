import psycopg2
from .base import DataIntrospector, TableMetadata
from typing import List, Dict

class PostgresIntrospector(DataIntrospector):
    """Introspector for PostgreSQL databases."""
    
    def __init__(self, dbname: str, user: str, password: str, host: str, port: str = "5432"):
        """
        Initialize PostgreSQL introspector.
        
        Args:
            dbname (str): Database name
            user (str): Username
            password (str): Password
            host (str): Host address
            port (str): Port number (default: "5432")
        """
        self.connection_params = {
            "dbname": dbname,
            "user": user,
            "password": password,
            "host": host,
            "port": port
        }
        # Verify connection
        self.validate_structure()
    
    def get_table_names(self) -> List[str]:
        """Get list of tables in PostgreSQL database."""
        with psycopg2.connect(**self.connection_params) as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public'
                AND table_type = 'BASE TABLE';
            """)
            return [row[0] for row in cursor.fetchall()]
    
    def get_table_metadata(self, table_name: str) -> TableMetadata:
        """
        Get metadata for a PostgreSQL table.
        
        Args:
            table_name (str): Name of the table
            
        Returns:
            TableMetadata: Metadata about the table
        """
        with psycopg2.connect(**self.connection_params) as conn:
            cursor = conn.cursor()
            
            # Verify table exists
            cursor.execute("""
                SELECT EXISTS (
                    SELECT FROM information_schema.tables 
                    WHERE table_schema = 'public' 
                    AND table_name = %s
                );
            """, (table_name,))
            if not cursor.fetchone()[0]:
                raise ValueError(f"Table does not exist: {table_name}")
            
            # Get column information
            cursor.execute("""
                SELECT column_name, data_type
                FROM information_schema.columns
                WHERE table_schema = 'public'
                AND table_name = %s
                ORDER BY ordinal_position;
            """, (table_name,))
            
            columns = [
                {"name": row[0], "type": row[1]}
                for row in cursor.fetchall()
            ]
            
            # Get row count
            cursor.execute(f"SELECT COUNT(*) FROM {table_name};")
            row_count = cursor.fetchone()[0]
            
            return TableMetadata(
                name=table_name,
                columns=columns,
                row_count=row_count
            )
    
    def validate_structure(self) -> bool:
        """
        Validate PostgreSQL database structure.
        Returns True if database is accessible.
        """
        try:
            with psycopg2.connect(**self.connection_params) as conn:
                cursor = conn.cursor()
                cursor.execute("SELECT current_database();")
                return True
        except psycopg2.Error as e:
            raise ValueError(f"Unable to connect to PostgreSQL database: {str(e)}")