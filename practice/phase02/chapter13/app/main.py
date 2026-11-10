# app/main.py 예시
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db import engine, Base
from app.routers import member_router  # 👈 라우터 임포트 확인

Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS 설정...
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5500", "http://127.0.0.1:5500"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 👇 라우터가 정상적으로 등록되어 있는지 반드시 확인하세요!
app.include_router(member_router.router)