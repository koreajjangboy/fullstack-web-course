from fastapi import FastAPI
from app.routers import member_router

app = FastAPI(
    title="Chapter 12 - SQLAlchemy ORM CRUD",
    version="1.0.0"
)

app.include_router(member_router.router)