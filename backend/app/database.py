from pymongo import MongoClient
from app.config import settings

client = MongoClient(settings.MONGO_URI)
db = client[settings.DATABASE_NAME]

def init_db():
    if 'users' not in db.list_collection_names():
        db.create_collection('users')
    
    if 'stores' not in db.list_collection_names():
        db.create_collection('stores')
        
def get_db():
    return db
