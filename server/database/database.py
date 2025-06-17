from motor.motor_asyncio import AsyncIOMotorClient
from config.settings import settings
from utils.logger import api_logger
from dotenv import load_dotenv
from pymongo.server_api import ServerApi
import asyncio
import certifi
import os

load_dotenv()

# MongoDB cấu hình từ settings
MONGODB_URL = settings.MONGODB_URL
DATABASE_NAME = settings.DATABASE_NAME

class Database:
    _instance = None
    _lock = asyncio.Lock()
    _client = None
    _db = None

    @classmethod
    async def get_instance(cls):
        if cls._instance is None:
            async with cls._lock:
                if cls._instance is None:
                    cls._instance = cls()
        return cls._instance

    async def get_database(self):
        if self._db is None:
            async with self._lock:
                if self._db is None:
                    try:
                        self._client = AsyncIOMotorClient(
                            MONGODB_URL,
                            server_api=ServerApi("1"),
                            tls=True,
                            tlsCAFile=certifi.where(),
                            tlsAllowInvalidCertificates=False,
                            connectTimeoutMS=30000,
                            socketTimeoutMS=30000,
                            maxPoolSize=50,
                            minPoolSize=10,
                            maxIdleTimeMS=45000,
                            waitQueueTimeoutMS=10000,
                        )
                        await self._client.admin.command("ping")
                        api_logger.info("✅ MongoDB connected successfully.")
                        self._db = self._client[DATABASE_NAME]
                    except Exception as e:
                        api_logger.error(f"❌ MongoDB connection failed: {str(e)}")
                        raise
        return self._db

    async def close(self):
        if self._client is not None:
            self._client = None
            self._db = None

# Global singleton
_db_instance = None

async def get_database():
    global _db_instance
    if _db_instance is None:
        _db_instance = await Database.get_instance()
    return await _db_instance.get_database()

async def init_db():
    """Gọi khi startup: kết nối & khởi tạo index nếu cần"""
    try:
        db = await get_database()
        await db.guilds.create_index("guild_name", unique=True)
    except Exception as e:
        api_logger.error(f"❌ init_db() failed: {str(e)}")
        raise

async def close_db():
    global _db_instance
    if _db_instance is not None:
        await _db_instance.close()
        _db_instance = None

# 💡 Collection getter functions
async def get_users_collection():
    db = await get_database()
    return db.users

async def get_guilds_collection():
    db = await get_database()
    return db.guilds

async def get_skills_collection():
    db = await get_database()
    return db.skills


