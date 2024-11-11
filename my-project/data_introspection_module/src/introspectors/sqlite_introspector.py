import sqlite3
from .base import DataIntrospector, TableMetadata
from typing import List, Dict

class SQLiteIntrospector(DataIntrospector):
    """Introspector for SQLite databases."""
    
    def __init__(self, db_path: str):
        """
        Initialize SQLite introspector.
        
        Args:
            db_path (str): Path to SQLite database file
        """
        self.db_path = db_path
        # Verify database exists and is valid
        self.validate_structure()
        
    def get_table_names(self) -> List[str]:
        """Get list of tables in SQLite database."""
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
            return [row[0] for row in cursor.fetchall()]
    
    def get_table_metadata(self, table_name: str) -> TableMetadata:
        """
        Get metadata for a SQLite table.
        
        Args:
            table_name (str): Name of the table
            
        Returns:
            TableMetadata: Metadata about the table
        """
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            
            # Verify table exists
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name=?;", (table_name,))
            if not cursor.fetchone():
                raise ValueError(f"Table does not exist: {table_name}")
            
            # Get column information
            cursor.execute(f"PRAGMA table_info({table_name});")
            columns = [
                {"name": row[1], "type": row[2]}
                for row in cursor.fetchall()
            ]
            
            # Get row count
            cursor.execute(f"SELECT COUNT(*) FROM {table_name};")
            row_count = cursor.fetchone()[0]
            
            return TableMetadata(
                name=table_name,
                columns=columns,
                row_count=row_count,
                file_path=self.db_path
            )
    
    def validate_structure(self) -> bool:
        """
        Validate SQLite database structure.
        Returns True if database is valid and accessible.
        """
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
                return True
        except sqlite3.Error as e:
            raise ValueError(f"Invalid SQLite database: {str(e)}")