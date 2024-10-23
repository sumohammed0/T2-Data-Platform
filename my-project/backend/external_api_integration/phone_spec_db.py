import sqlite3

def init_db():
    conn = sqlite3.connect("phones.db")
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS phones (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            brand TEXT,
            model TEXT
        )
    """)
    conn.commit()
    conn.close()

def insert_phone(brand, model):
    conn = sqlite3.connect("phones.db")
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO phones (brand, model) VALUES (?, ?)
    """, (brand, model))
    conn.commit()
    conn.close()

def get_all_phones():
    conn = sqlite3.connect("phones.db")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM phones")
    phones = cursor.fetchall()
    conn.close()
    return phones
