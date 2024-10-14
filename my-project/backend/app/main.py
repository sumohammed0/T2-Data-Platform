from fastapi import FastAPI, UploadFile, File, Depends, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from . import models
from . import schemas
from .database import engine, get_db
import pandas as pd
import io

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS middleware makes sure communication is working across front end port 5173 and backend port 8000
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  #React app's URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



#csv File upload
@app.post("/upload-csv")
async def upload_csv(file: UploadFile = File(...)):
    contents = await file.read()
    df = pd.read_csv(io.StringIO(contents.decode('utf-8')))
    return {"data": df.to_dict(orient="records")}

#databases
@app.get("/databases", response_model=list[schemas.Database])
def list_databases(db: Session = Depends(get_db)):
    return db.query(models.Database).all()

#create new database entry
@app.post("/databases", response_model=schemas.Database)
def create_database(database: schemas.DatabaseCreate, db: Session = Depends(get_db)):
    db_database = models.Database(**database.dict())
    db.add(db_database)
    db.commit()
    db.refresh(db_database)
    return db_database