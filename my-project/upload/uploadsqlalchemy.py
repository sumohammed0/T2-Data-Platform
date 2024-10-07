import sqlalchemy as db
import pandas as pd

engine = db.create_engine("sqlite:///test.db")
conn = engine.connect() # connection to database
metadata = db.MetaData() # contains information about the database such as table name, column names etc

df = pd.read_csv("../../5g_core_data.csv")

# automatically infers the schema from the DataFrame
df.to_sql(name='Sample_Data', con=engine, if_exists="replace", index=False)

"""validate data upload"""
# creating a table object called sample_data
sample_data = db.Table('Sample_Data', metadata, autoload_with=engine)

# query
query = sample_data.select()
exe = conn.execute(query)
result = exe.fetchmany(5) # top 5

for r in result:
    print(r)
print(f"file uploaded to: {sample_data.fullname} table")

conn.close()