from datetime import datetime
from typing import Optional, List
from motor.motor_asyncio import AsyncIOMotorClient
from database.database import  get_users_collection, get_guilds_collection
from models.guild import GuildModel
from bson import ObjectId
import random


async def create_guild(user_id: str, guild_name: str, description: Optional[str] = None) -> GuildModel:
    guilds = await get_guilds_collection()
    users = await get_users_collection()

    # Tên không được trùng
    existing = await guilds.find_one({"guild_name": guild_name})
    if existing:
        raise ValueError("Tên guild đã tồn tại. Vui lòng chọn tên khác.")

    user = await users.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise ValueError("User không tồn tại")

    user_name = user.get("name", "unknown")

    guild_data = {
        "guild_name": guild_name,
        "description": description,
        "owner_id": user_id,
        "owner_name": user_name,
        "members": [user_id],
        "created_at": datetime.utcnow(),
    }

    result = await guilds.insert_one(guild_data)
    guild_data["_id"] = str(result.inserted_id)
    return GuildModel(**guild_data)

async def leave_guild(user_id: str, guild_name: str):
    guilds = await get_guilds_collection()
    guild = await guilds.find_one({"guild_name": guild_name})
    
    if not guild:
        raise ValueError("Không tìm thấy guild")

    if user_id not in guild["members"]:
        raise ValueError("Bạn không thuộc guild này")

    # Nếu là chủ guild thì không cho rời (hoặc có logic khác tuỳ bạn)
    if guild["owner_id"] == user_id:
        raise ValueError("Chủ guild không thể rời guild")

    await guilds.update_one(
        {"_id": guild["_id"]},
        {"$pull": {"members": user_id}}
    )




async def get_guilds_by_user(user_id: str) -> List[GuildModel]:
    guilds_collection = await get_guilds_collection()
    cursor = guilds_collection.find({"members": user_id})

    results = []
    async for guild in cursor:
        guild["_id"] = str(guild["_id"])
        results.append(GuildModel(**guild))
    
    if not results:
        raise ValueError("User chưa tham gia guild nào")
    
    return results



async def invite_user_to_guild(owner_id: str, user_to_invite_id: str) -> GuildModel:
    guilds = await get_guilds_collection()
    users = await get_users_collection()

    # Chỉ chủ guild mới được mời người
    guild = await guilds.find_one({"owner_id": owner_id})
    if not guild:
        raise ValueError("Bạn không phải chủ guild")

    if user_to_invite_id in guild["members"]:
        raise ValueError("Người dùng đã có trong guild")

    await guilds.update_one(
        {"_id": guild["_id"]},
        {"$push": {"members": user_to_invite_id}}
    )

    updated = await guilds.find_one({"_id": guild["_id"]})
    updated["_id"] = str(updated["_id"])  # ép ObjectId thành str
    return GuildModel(**updated)


async def reset_guild_for_user(user_id: str):
    guilds = await get_guilds_collection()
    await guilds.delete_many({"owner_id": user_id})

async def search_guilds_by_keyword(keyword: str) -> list[GuildModel]:
    guilds = await get_guilds_collection()
    cursor = guilds.find({"guild_name": {"$regex": keyword, "$options": "i"}}).limit(10)
    results = []
    async for guild in cursor:
        guild["_id"] = str(guild["_id"])
        results.append(GuildModel(**guild))
    return results

async def join_guild(user_id: str, guild_name: str) -> GuildModel:
    guilds = await get_guilds_collection()
    users = await get_users_collection()

    # Tìm guild theo tên
    guild = await guilds.find_one({"guild_name": guild_name})
    if not guild:
        raise ValueError("Không tìm thấy guild với tên đã nhập")

    # Kiểm tra người dùng đã tham gia chưa
    if user_id in guild["members"]:
        raise ValueError("Bạn đã tham gia guild này rồi")

    # Cập nhật thêm user vào guild
    await guilds.update_one(
        {"_id": guild["_id"]},
        {"$push": {"members": user_id}}
    )

    # Trả lại guild đã cập nhật
    updated = await guilds.find_one({"_id": guild["_id"]})
    updated["_id"] = str(updated["_id"])  # Convert ObjectId -> str
    return GuildModel(**updated)


async def get_guilds_with_min_members(min_members: int = 5) -> List[GuildModel]:
    guilds_collection = await get_guilds_collection()

    cursor = guilds_collection.find({
        "$expr": {
            "$gte": [
                { "$size": "$members" },
                min_members
            ]
        }
    })

    results = []
    async for guild in cursor:
        guild["_id"] = str(guild["_id"])
        results.append(GuildModel(**guild))
    return results



