from app.models.users import User, UserInDB, CreateUser
from app.database import get_db
from fastapi import APIRouter, HTTPException
from datetime import datetime
# import hashing library for password hashing
from passlib.context import CryptContext

router = APIRouter()

@router.post("/", response_model=User)
async def create_user(user: CreateUser):
    try:
        db = get_db()
        current_time = datetime.utcnow()
        pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
        hashed_password = pwd_context.hash(user.password)
        user.password = hashed_password
        
        user_dict = {
            "username": user.username,
            "email": user.email,
            "password": user.password,
            "created_at": current_time,
            "updated_at": current_time,
        }
        
        result = db.users.insert_one(user_dict)
        
        return User(
            id=str(result.inserted_id),
            username=user.username,
            email=user.email,
            created_at=current_time,
            updated_at=current_time
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

