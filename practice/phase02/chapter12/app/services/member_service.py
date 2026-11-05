from fastapi import HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.repositories import member_repository
from app.schemas import MemberCreate, MemberUpdate, MemberPatch

def create_member_service(db: Session, payload: MemberCreate):
    # 1차 방어: 비즈니스 규칙 검증
    existing = member_repository.find_by_email(db, str(payload.email))
    if existing is not None:
        raise HTTPException(status_code=409, detail="Email already exists")
    
    try:
        return member_repository.create_member(
            db,
            payload.name,
            str(payload.email),
            payload.age,
        )
    except IntegrityError:
        # 2차 방어: DB Constraint 위반(동시성 이슈 등) 시 409로 변환
        raise HTTPException(status_code=409, detail="Email already exists")

def delete_member_service(db: Session, member_id: int):
    member = member_repository.find_by_id(db, member_id)
    if member is None:
        raise HTTPException(status_code=404, detail="Member not found")
    member_repository.delete_member(db, member)