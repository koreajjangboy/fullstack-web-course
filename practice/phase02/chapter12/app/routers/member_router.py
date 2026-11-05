from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.db import get_db
from app.schemas import MemberResponse, MemberCreate, MemberUpdate, MemberPatch
from app.repositories import member_repository
from app.services import member_service

router = APIRouter(prefix="/members", tags=["Members"])

# 1. 전체 회원 조회
@router.get("", response_model=List[MemberResponse])
def get_members(db: Session = Depends(get_db)):
    return member_repository.find_all(db)

# 2. 특정 회원 조회
@router.get("/{member_id}", response_model=MemberResponse)
def get_member(member_id: int, db: Session = Depends(get_db)):
    member = member_repository.find_by_id(db, member_id)
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    return member

# 3. 회원 생성 (Create)
@router.post("", response_model=MemberResponse, status_code=status.HTTP_201_CREATED)
def create_member(payload: MemberCreate, db: Session = Depends(get_db)):
    return member_service.create_member_service(db, payload)

# 4. 회원 전체 수정 (PUT)
@router.put("/{member_id}", response_model=MemberResponse)
def update_member(member_id: int, payload: MemberUpdate, db: Session = Depends(get_db)):
    member = member_repository.find_by_id(db, member_id)
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    return member_repository.update_member(db, member, payload)

# 5. 회원 부분 수정 (PATCH)
@router.patch("/{member_id}", response_model=MemberResponse)
def patch_member(member_id: int, payload: MemberPatch, db: Session = Depends(get_db)):
    changes = payload.model_dump(exclude_unset=True)
    if not changes:
        raise HTTPException(status_code=400, detail="At least one field is required")
    
    member = member_repository.find_by_id(db, member_id)
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    return member_repository.patch_member(db, member, payload)

# 6. 회원 삭제 (DELETE)
@router.delete("/{member_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_member(member_id: int, db: Session = Depends(get_db)):
    member_service.delete_member_service(db, member_id)
    return None