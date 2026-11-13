from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db import engine, Base
from app.routers import member_router, product_router  # 둘 다 임포트

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Mini Pop-up Store API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5500",
        "http://127.0.0.1:5500",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 라우터 둘 다 등록
app.include_router(member_router.router)
app.include_router(product_router.router)

@app.get("/")
def root():
    return {"message": "API is running successfully!"}