from fastapi import APIRouter, Depends, HTTPException
from models.guild import GuildModel
from services.guild_service import (
    create_guild,
    get_guilds_by_user,
    invite_user_to_guild,
    reset_guild_for_user,
    search_guilds_by_keyword,
    join_guild,
    leave_guild
)
from routes.users import get_current_user
from pydantic import BaseModel
from typing import Optional
# Thêm List vào đây
from typing import Optional, List



class GuildCreateRequest(BaseModel):
    guild_name: str
    description: Optional[str] = None

class LeaveGuildRequest(BaseModel):
    guild_name: str

router = APIRouter()


@router.post("/guild/create", response_model=GuildModel)
async def create_my_guild(payload: GuildCreateRequest, current_user=Depends(get_current_user)):
    try:
        return await create_guild(str(current_user["_id"]), payload.guild_name, payload.description)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/guild/leave", summary="Rời guild bằng tên")
async def leave_guild_by_name_route(
    payload: LeaveGuildRequest,
    current_user=Depends(get_current_user)
):
    try:
        await leave_guild(str(current_user["_id"]), payload.guild_name)
        return {"message": "Rời guild thành công"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/guild/me", response_model=List[GuildModel])
async def get_my_guilds(current_user=Depends(get_current_user)):
    try:
        return await get_guilds_by_user(str(current_user["_id"]))
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.post("/guild/invite", response_model=GuildModel)
async def invite_to_guild(user_id: str, current_user=Depends(get_current_user)):
    try:
        return await invite_user_to_guild(str(current_user["_id"]), user_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/guild/reset")
async def reset_my_guild(current_user=Depends(get_current_user)):
    await reset_guild_for_user(str(current_user["_id"]))
    return {"message": "Guild đã được reset"}


@router.get("/guild/search", response_model=List[GuildModel])
async def search_guilds(keyword: str):
    return await search_guilds_by_keyword(keyword)


@router.post("/guild/join", response_model=GuildModel)
async def join_guild_route(
        payload: GuildCreateRequest,
        current_user=Depends(get_current_user)):
    try:
        return await join_guild(str(current_user["_id"]), payload.guild_name)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
