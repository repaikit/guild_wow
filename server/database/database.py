from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()  # Tải biến môi trường từ .env

MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")

client = AsyncIOMotorClient(MONGO_URL)
db = client["guild_app"]

async def get_database():
    return db

async def get_users_collection():
    return db["users"]
