from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.guild_route import router as guild_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # hoặc chỉnh lại domain frontend của bạn
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(guild_router, prefix="/api", tags=["guild"])

@app.get("/")
async def root():
    return {"message": "Guild API chạy ngon lành"}
