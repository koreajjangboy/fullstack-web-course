from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db import get_db
from app.schemas import MemberResponse, MemberCreate, MemberUpdate, MemberPatch
from app.repositories import member_repository

router = APIRouter(prefix="/members", tags=["Members"])

# 1. 전체 회원 목록 조회 (GET /members)
@router.get("", response_model=List[MemberResponse])
def get_members(db: Session = Depends(get_db)):
    return member_repository.find_all(db)

# 2. 단건 회원 조회 (GET /members/{member_id})
@router.get("/{member_id}", response_model=MemberResponse)
def get_member(member_id: int, db: Session = Depends(get_db)):
    member = member_repository.find_by_id(db, member_id)
    if not member:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Member not found"
        )
    return member

# 3. 회원 생성 (POST /members)
@router.post("", response_model=MemberResponse, status_code=status.HTTP_201_CREATED)
def create_member(payload: MemberCreate, db: Session = Depends(get_db)):
    existing = member_repository.find_by_email(db, payload.email)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered"
        )
    return member_repository.create_member(db, payload)

# 4. 전체 회원 정보 수정 (PUT /members/{member_id})
@router.put("/{member_id}", response_model=MemberResponse)
def update_member(member_id: int, payload: MemberUpdate, db: Session = Depends(get_db)):
    member = member_repository.find_by_id(db, member_id)
    if not member:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Member not found"
        )
    return member_repository.update_member(db, member, payload)

# 5. 부분 회원 정보 수정 (PATCH /members/{member_id})
@router.patch("/{member_id}", response_model=MemberResponse)
def patch_member(member_id: int, payload: MemberPatch, db: Session = Depends(get_db)):
    member = member_repository.find_by_id(db, member_id)
    if not member:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Member not found"
        )
    return member_repository.patch_member(db, member, payload)

# 6. 회원 삭제 (DELETE /members/{member_id})
@router.delete("/{member_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_member(member_id: int, db: Session = Depends(get_db)):
    member = member_repository.find_by_id(db, member_id)
    if not member:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Member not found"
        )
    member_repository.delete_member(db, member)
    return None