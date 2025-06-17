from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel
from utils.time_utils import get_vietnam_time
from database.database import get_users_collection, get_skills_collection
import uuid
import random
from utils.jwt import create_access_token
from models.user import User, UserCreate

from typing import Optional
# Thêm List vào đây
from typing import Optional, List

router = APIRouter()

async def get_random_skill(skills_collection, skill_type: str) -> str:
    skills = await skills_collection.find({"type": skill_type}).to_list(length=None)
    if not skills:
        raise HTTPException(status_code=500, detail=f"No {skill_type} skills found in database")
    return random.choice(skills)["name"]

@router.post("/guest")
async def create_guest_user(request: Request):
    """Tạo guest user với 5 lượt chơi và random 1 kỹ năng mỗi loại"""
    users_collection = await get_users_collection()
    skills_collection = await get_skills_collection()
    session_id = str(uuid.uuid4())
    kicker_skill = await get_random_skill(skills_collection, "kicker")
    goalkeeper_skill = await get_random_skill(skills_collection, "goalkeeper")
    avatar_seed = str(uuid.uuid4())
    avatar_url = f"https://api.dicebear.com/7.x/adventurer/svg?seed={avatar_seed}"
    now = get_vietnam_time()
    guest_user = UserCreate(
        user_type="guest",
        session_id=session_id,
        remaining_matches=5,
        kicker_skills=[kicker_skill],
        goalkeeper_skills=[goalkeeper_skill],
        avatar=avatar_url,
        created_at=now.isoformat(),
        updated_at=now.isoformat(),
        last_activity=now.isoformat(),
        total_point=0,
        bonus_point=0.0,
    ).dict(by_alias=True)
    result = await users_collection.insert_one(guest_user)
    created_user = await users_collection.find_one({"_id": result.inserted_id})
    # Generate JWT for guest user
    token = create_access_token({"_id": str(created_user["_id"])})
    return {
        "user": User(**created_user),
        "access_token": token,
        "token_type": "bearer"
    }


@router.get("/me")
async def get_current_user(request: Request):
    """Lấy thông tin user hiện tại từ JWT"""
    user = getattr(request.state, "user", None)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    user["_id"] = str(user["_id"])
    return user