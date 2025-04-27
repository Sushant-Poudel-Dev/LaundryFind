from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class CreateUser(BaseModel):
    username: str
    email: str
    password: str

class User(BaseModel):
    id: str
    username: str
    email: str
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
        
class UserInDB(User):
    id: str
    username: str
    email: str
    hashed_password: str
    created_at: datetime
    updated_at: datetime

