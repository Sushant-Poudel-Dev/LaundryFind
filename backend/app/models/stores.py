from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

class Location(BaseModel):
    city: Optional[str] = None
    address: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class Contact(BaseModel):
    phone: Optional[str] = None
    email: Optional[str] = None
    website: Optional[str] = None

class CreateStore(BaseModel):
    name: str
    description: Optional[str] = None
    thumbnail: Optional[str] = None
    images: Optional[List[str]] = None
    location: Optional[Location] = None
    contact: Optional[Contact] = None
    opening_hours: Optional[str] = None
    is_active: bool = True
    is_verified: bool = False
    is_delivery: bool = False
    price_per_kg: Optional[float] = None

class Store(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    thumbnail: Optional[str] = None
    images: Optional[List[str]] = None
    location: Optional[Location] = None
    contact: Optional[Contact] = None
    opening_hours: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    is_active: bool = True
    is_verified: bool = False
    is_delivery: bool = False
    price_per_kg: Optional[float] = None

    class Config:
        orm_mode = True
        
class StoreInDB(Store):
    pass


