from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel
from utils.time_utils import get_vietnam_time
from database.database import get_users_collection, get_skills_collection
import uuid
import random
from utils.jwt import create_access_token
from models.user import User, UserCreate, TokenResponse
from utils.logger import api_logger
from utils.password import get_password_hash, verify_password
from utils.weekly_utils import update_weekly_login, get_weekly_stats
from pydantic import BaseModel, EmailStr
from utils.content_filter import contains_sensitive_content, validate_username
from utils.wallet_generator import generate_evm_wallet
from utils.email_utils import send_verification_email

def generate_wallets():
    """
    Tạo ví cho người dùng mới.
    Hiện tại chỉ hỗ trợ EVM wallet.
    """
    wallet = generate_evm_wallet()
    return {
        "mnemonic": wallet["mnemonic"],
        "private_key": wallet["private_key"],
        "public_address": wallet["public_address"]
    }


from typing import Optional
# Thêm List vào đây
from typing import Optional, List

router = APIRouter()

class RegularAuthRequest(BaseModel):
    email: EmailStr
    password: str
    name: Optional[str] = None

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

@router.post("/auth/login")
async def login_user(data: RegularAuthRequest):
    """Đăng nhập với email và mật khẩu"""
    try:
        users_collection = await get_users_collection()
        
        # Tìm user theo email
        existing_user = await users_collection.find_one({"email": data.email})
        
        if not existing_user:
            raise HTTPException(
                status_code=404,
                detail="User not found. Please register first."
            )
            
        # Kiểm tra mật khẩu
        if not verify_password(data.password, existing_user.get("password", "")):
            raise HTTPException(
                status_code=401,
                detail="Invalid password"
            )
        
        # Cập nhật thông tin đăng nhập và điểm tuần
        update_data = {
            "last_login": get_vietnam_time().isoformat(),
            "updated_at": get_vietnam_time().isoformat(),
        }
        
        # Cập nhật thông tin đăng nhập theo tuần
        user_data = update_weekly_login(existing_user)
        update_data.update({
            "weekly_logins": user_data["weekly_logins"],
            "total_point": user_data["total_point"]
        })
        
        await users_collection.update_one(
            {"_id": existing_user["_id"]},
            {"$set": update_data}
        )
        
        # Tạo access token
        access_token = create_access_token({"_id": str(existing_user["_id"])})
        
        return TokenResponse(
            access_token=access_token
        )
        
    except Exception as e:
        api_logger.error(f"Error in login: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Login failed: {str(e)}"
        )
        
@router.post("/auth/register")
async def register_user(data: RegularAuthRequest):
    """Đăng ký tài khoản mới với email và mật khẩu"""
    try:
        users_collection = await get_users_collection()
        skills_collection = await get_skills_collection()
        
        # Kiểm tra email đã tồn tại chưa
        existing_user = await users_collection.find_one({"email": data.email})
        if existing_user:
            raise HTTPException(
                status_code=400,
                detail="Email already registered. Please login instead."
            )

        # Kiểm tra nội dung nhạy cảm trong tên
        if data.name:
            is_sensitive, reason = contains_sensitive_content(data.name)
            if is_sensitive:
                raise HTTPException(
                    status_code=400,
                    detail=f"Name contains sensitive content: {reason}"
                )

        # Sinh token xác thực email
        email_verification_token = str(uuid.uuid4())
        session_id = str(uuid.uuid4())
        kicker_skill = await get_random_skill(skills_collection, "kicker")
        goalkeeper_skill = await get_random_skill(skills_collection, "goalkeeper")
        hashed_password = get_password_hash(data.password)
        now = get_vietnam_time().isoformat()
        avatar_seed = str(uuid.uuid4())
        avatar_url = f"https://api.dicebear.com/7.x/adventurer/svg?seed={avatar_seed}"
        
        # Tạo ví cho user
        wallets = generate_wallets()
        
        new_user = UserCreate(
            user_type="user",
            session_id=session_id,
            avatar=avatar_url,
            email=data.email,
            password=hashed_password,
            auth_provider="email",
            name=data.name or "Player",
            kicker_skills=[kicker_skill],
            goalkeeper_skills=[goalkeeper_skill],
            created_at=now,
            updated_at=now,
            last_login=now,
            is_verified=False,
            email_verification_token=email_verification_token,
            # Thông tin ví
            evm_mnemonic=wallets["mnemonic"],
            evm_private_key=wallets["private_key"],
            evm_address=wallets["public_address"],
            sol_mnemonic=wallets["mnemonic"],
            sol_private_key=wallets["private_key"],
            sol_address=wallets["public_address"],
            sui_mnemonic=wallets["mnemonic"],
            sui_private_key=wallets["private_key"],
            sui_address=wallets["public_address"]
        ).dict(by_alias=True)
        
        try:
            result = await users_collection.insert_one(new_user)
            if not result.inserted_id:
                raise Exception("Failed to insert user into database")
            send_verification_email(data.email, email_verification_token)
            # Trả về cho FE chỉ địa chỉ ví
            return {
                "message": "Registration successful. Please check your email to verify your account.",
                "evm_address": wallets["public_address"],
                "sol_address": wallets["public_address"],
                "sui_address": wallets["public_address"]
            }
        except Exception as db_error:
            api_logger.error(f"Database error during registration: {str(db_error)}")
            raise HTTPException(
                status_code=500,
                detail=f"Database error: {str(db_error)}"
            )
    except HTTPException as he:
        raise he
    except Exception as e:
        api_logger.error(f"Error in registration: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Registration failed: {str(e)}"
        )
