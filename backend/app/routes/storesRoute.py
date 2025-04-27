from app.models.stores import Store, StoreInDB, CreateStore, Location, Contact
from app.database import get_db
from fastapi import APIRouter, HTTPException, Query
from datetime import datetime
from typing import List
from bson import ObjectId

router = APIRouter()

@router.post("/", response_model=Store)
async def create_store(store: CreateStore):
    try:
        db = get_db()
        current_time = datetime.utcnow()
        
        # Convert the Pydantic model to a dictionary with the nested structure
        store_dict = store.dict()
        store_dict["created_at"] = current_time
        store_dict["updated_at"] = current_time
        
        result = db.stores.insert_one(store_dict)
        
        # Return a complete Store object
        return Store(
            id=str(result.inserted_id),
            **store_dict
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    
@router.get("/", response_model=List[Store])
async def get_all_stores(city: str = Query(None, description="Filter stores by city")):
    try:
        db = get_db()
        
        # Apply city filter if provided
        if city:
            # Case insensitive search for city
            query = {"location.city": {"$regex": city, "$options": "i"}}
            stores = db.stores.find(query)
        else:
            stores = db.stores.find()
            
        store_list = []
        
        for store in stores:
            # Convert MongoDB document to Store model
            store_data = dict(store)
            store_data["id"] = str(store_data.pop("_id"))
            
            # Create Store object, handling nested data structures
            store_obj = Store(**store_data)
            store_list.append(store_obj)
        
        return store_list
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.get("/search", response_model=List[Store])
async def search_stores(query: str = Query(..., description="Search query for store name or address")):
    try:
        db = get_db()
        
        # Case insensitive search for name or address
        search_query = {
            "$or": [
                {"name": {"$regex": query, "$options": "i"}},
                {"location.address": {"$regex": query, "$options": "i"}}
            ]
        }
        
        stores = db.stores.find(search_query)
        store_list = []
        
        for store in stores:
            # Convert MongoDB document to Store model
            store_data = dict(store)
            store_data["id"] = str(store_data.pop("_id"))
            
            # Create Store object, handling nested data structures
            store_obj = Store(**store_data)
            store_list.append(store_obj)
        
        return store_list
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.get("/city/{city_name}", response_model=List[Store])
async def get_stores_by_city(city_name: str):
    try:
        db = get_db()
        
        # Case insensitive search for city
        query = {"location.city": {"$regex": city_name, "$options": "i"}}
        stores = db.stores.find(query)
        
        store_list = []
        
        for store in stores:
            # Convert MongoDB document to Store model
            store_data = dict(store)
            store_data["id"] = str(store_data.pop("_id"))
            
            # Create Store object, handling nested data structures
            store_obj = Store(**store_data)
            store_list.append(store_obj)
        
        return store_list
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.get("/{store_id}", response_model=Store)
async def get_store_by_id(store_id: str):
    try:
        db = get_db()
        
        # Check if the ID is a valid ObjectId format
        if not ObjectId.is_valid(store_id):
            raise HTTPException(status_code=400, detail="Invalid store ID format")
            
        # Find the store by its ID
        store = db.stores.find_one({"_id": ObjectId(store_id)})
        
        if not store:
            raise HTTPException(status_code=404, detail="Store not found")
            
        # Convert MongoDB document to Store model
        store_data = dict(store)
        store_data["id"] = str(store_data.pop("_id"))
        
        # Create and return Store object
        return Store(**store_data)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
