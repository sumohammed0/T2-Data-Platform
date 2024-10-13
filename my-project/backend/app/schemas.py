from pydantic import BaseModel

class DatabaseBase(BaseModel):
    name: str
    connection_string: str

class DatabaseCreate(DatabaseBase):
    pass

class Database(DatabaseBase):
    id: int

    class Config:
        orm_mode = True