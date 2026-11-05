from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.db import SessionLocal
from app.models import Member

app = FastAPI()

# DB 세션 의존성 주입 함수
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 전체 회원 조회 엔드포인트
@app.get("/members")
def get_members(db: Session = Depends(get_db)):
    stmt = select(Member).order_by(Member.member_id)
    members = db.scalars(stmt).all()
    return members

# 특정 회원 조회 엔드포인트
@app.get("/members/{member_id}")
def get_member(member_id: int, db: Session = Depends(get_db)):
    stmt = select(Member).where(Member.member_id == member_id)
    member = db.scalar(stmt)
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    return member