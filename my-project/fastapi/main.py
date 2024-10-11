from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy import create_engine, MetaData, Table
from sqlalchemy.exc import SQLAlchemyError
from pydantic import BaseModel
import pandas as pd
import os
import csv
from datetime import datetime, timedelta
import random
import string

app = FastAPI()

# Helper functions (from your generate_csv.py)
def generate_random_data(data_type):
    if data_type == 'int':
        return random.randint(0, 1000)
    elif data_type == 'string':
        return ''.join(random.choices(string.ascii_letters, k=5))
    else:
        raise ValueError(f"Unsupported data type: {data_type}")

def generate_csv(filename, start_date, end_date, interval, columns):
    with open(filename, 'w', newline='') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(['datetime'] + [col['name'] for col in columns])
        current_date = start_date
        while current_date <= end_date:
            row = [current_date.isoformat()]
            for col in columns:
                row.append(generate_random_data(col['type']))
            writer.writerow(row)
            current_date += timedelta(minutes=interval)

# Routes
@app.post("/generate-csv")
async def generate_csv_file(start_date: str, end_date: str, interval: int):
    filename = f"generated_data_{datetime.now().strftime('%Y%m%d%H%M%S')}.csv"
    start = datetime.strptime(start_date, "%Y-%m-%d %H:%M")
    end = datetime.strptime(end_date, "%Y-%m-%d %H:%M")
    
    columns = [
        {'name': 'session_id', 'type': 'string'},
        {'name': 'user_equipment_id', 'type': 'string'},
        {'name': 'amf_instance_id', 'type': 'string'},
        {'name': 'smf_instance_id', 'type': 'string'},
        {'name': 'upf_instance_id', 'type': 'string'},
        {'name': 'number_of_active_bearers', 'type': 'int'},
        {'name': 'data_volume_uplink_mb', 'type': 'int'},
        {'name': 'data_volume_downlink_mb', 'type': 'int'},
        {'name': 'latency_ms', 'type': 'int'},
        {'name': 'packet_loss_rate', 'type': 'int'},
        {'name': 'connection_failures', 'type': 'int'},
        {'name': 'handover_attempts', 'type': 'int'},
        {'name': 'handover_successes', 'type': 'int'},
        {'name': 'signaling_traffic_volume_kb', 'type': 'int'},
    ]
    
    generate_csv(filename, start, end, interval, columns)
    return FileResponse(filename, filename=filename)

@app.get("/databases")
async def get_databases():
    # In a real-world scenario, you'd query your database system for this information
    # For this example, we'll return a mock list
    return ["db1", "db2", "db3"]

@app.get("/tables/{database}")
async def get_tables(database: str):
    # Again, in a real scenario, you'd query the database for this information
    # Here's a mock response
    return [f"{database}_table1", f"{database}_table2", f"{database}_table3"]

class UploadRequest(BaseModel):
    database: str
    table: str

@app.post("/upload")
async def upload_file(file: UploadFile = File(...), request: UploadRequest = None):
    if not file:
        raise HTTPException(400, detail="No file provided")
    
    contents = await file.read()
    df = pd.read_csv(pd.compat.StringIO(contents.decode('utf-8')))
    
    engine = create_engine(f"sqlite:///{request.database}.db")
    
    try:
        df.to_sql(name=request.table, con=engine, if_exists="replace", index=False)
        return {"message": "File uploaded successfully"}
    except SQLAlchemyError as e:
        raise HTTPException(500, detail=str(e))

@app.get("/table-data/{database}/{table}")
async def get_table_data(database: str, table: str):
    engine = create_engine(f"sqlite:///{database}.db")
    metadata = MetaData()
    
    try:
        table_obj = Table(table, metadata, autoload_with=engine)
        with engine.connect() as conn:
            result = conn.execute(table_obj.select().limit(100)).fetchall()
            columns = [col.name for col in table_obj.columns]
            data = [dict(zip(columns, row)) for row in result]
        return {"columns": columns, "data": data}
    except SQLAlchemyError as e:
        raise HTTPException(500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)