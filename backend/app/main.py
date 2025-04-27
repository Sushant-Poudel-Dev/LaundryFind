from fastapi import FastAPI, HTTPException
from datetime import datetime
from app.database import init_db, get_db
from fastapi.middleware.cors import CORSMiddleware
from app.routes import usersRoute, storesRoute

app = FastAPI()

origins = [
    "http://localhost:5173",  
    "http://127.0.0.1:8000"
    "https://localhost:8000",  
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_db():
    init_db()
    
app.include_router(usersRoute.router, prefix="/users", tags=["Users"])
app.include_router(storesRoute.router, prefix="/stores", tags=["Stores"])