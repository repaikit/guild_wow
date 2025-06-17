from fastapi import FastAPI,Request
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os
from routes.guild_route import router as guild_router
from routes.users import router as user_router
from config.settings import settings
from database.database import init_db, close_db
from middleware.jwt_auth import JWTAuthMiddleware


# ✅ Lifespan event handler
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🔌 Starting up...")
    try:
        await init_db()
        print("✅ DB Initialized")
    except Exception as e:
        import traceback
        print("❌ Error in init_db:", str(e))
        traceback.print_exc()
    yield
    print("🛑 Shutting down...")
    await close_db()



# ✅ Khởi tạo FastAPI app
app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    lifespan=lifespan
)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    import traceback
    print("🔥 Global exception caught:", exc)
    traceback.print_exc()
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error", "error": str(exc)},
    )

@app.middleware("http")
async def log_requests(request, call_next):
    try:
        response = await call_next(request)
        return response
    except Exception as e:
        import traceback
        print("🔥 Middleware caught error:", str(e))
        traceback.print_exc()
        raise e

print("🧪 CORS_ORIGINS =", settings.CORS_ORIGINS)


# ✅ CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(JWTAuthMiddleware)

# ✅ Include guild routes
app.include_router(guild_router, prefix="/api", tags=["guild"])
app.include_router(user_router, prefix="/api", tags=["user"])


# ✅ Default route
from fastapi.responses import JSONResponse

@app.get("/")
async def root():
    return {"ok": True}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app", 
        host="0.0.0.0", 
        port=int(os.getenv("PORT",3000)),
        reload=settings.DEBUG,
        )
