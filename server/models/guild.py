from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from bson import ObjectId


class GuildModel(BaseModel):
    id: str = Field(..., alias="_id")
    guild_name: str
    owner_id: str
    owner_name: Optional[str] = ""
    members: List[str] = []
    created_at: datetime

    model_config = {
        "populate_by_name": True,
        "json_encoders": {
            ObjectId: str
        }
    }

