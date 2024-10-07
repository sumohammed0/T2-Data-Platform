import sqlalchemy as db
import pandas as pd

database_name = input("Which database do you want to upload to? \n")
tablename = input("Name of table: \n")
filepath = input("Enter filepath: \n")

engine = db.create_engine(f"sqlite:///{database_name}")
conn = engine.connect() # connection to database
metadata = db.MetaData() # contains information about the database such as table name, column names etc

df = pd.read_csv(filepath)

# automatically infers the schema from the DataFrame
df.to_sql(name=tablename, con=engine, if_exists="replace", index=False)

"""validate data upload"""
# creating a table object called sample_data
sample_data = db.Table(tablename, metadata, autoload_with=engine)

# query
query = sample_data.select()
exe = conn.execute(query)
result = exe.fetchmany(5) # top 5

for r in result:
    print(r)
print(f"file uploaded to: {sample_data.fullname} table")

conn.close()