from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db import get_db
from app.schemas import MemberResponse, MemberCreate
from app.repositories import member_repository

router = APIRouter(prefix="/members", tags=["Members"])

# 1. 전체 회원 목록 조회 (GET /members) 👉 프론트엔드 연동 핵심!
@router.get("", response_model=List[MemberResponse])
def get_members(db: Session = Depends(get_db)):
    return member_repository.find_all(db)

# 2. 단건 회원 조회 (GET /members/{member_id}) 👉 404 예외 처리 포함
@router.get("/{member_id}", response_model=MemberResponse)
def get_member(member_id: int, db: Session = Depends(get_db)):
    member = member_repository.find_by_id(db, member_id)
    if not member:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Member not found"
        )
    return member

# 3. 회원 생성 (POST /members) 👉 201 Created 및 409 Conflict 처리
@router.post("", response_model=MemberResponse, status_code=status.HTTP_201_CREATED)
def create_member(payload: MemberCreate, db: Session = Depends(get_db)):
    existing = member_repository.find_by_email(db, payload.email)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered"
        )
    return member_repository.create_member(db, payload)