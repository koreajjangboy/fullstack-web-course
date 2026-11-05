from fastapi import FastAPI
from app.db import engine, Base
from app.routers import member_router

# 앱 시작 시 테이블 생성
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Chapter 13 - Exception, Logging & TestClient",
    version="1.0.0"
)

app.include_router(member_router.router)