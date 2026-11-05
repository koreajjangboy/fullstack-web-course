from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from app.db import get_db
from app.schemas import MemberResponse
from app.repositories import member_repository

router = APIRouter(prefix="/members", tags=["Members"])

# ... (기존 GET /members 등은 유지) ...

# 2. 단건 회원 조회 (404 예외 처리 포함)
@router.get("/{member_id}", response_model=MemberResponse)
def get_member(member_id: int, db: Session = Depends(get_db)):
    member = member_repository.find_by_id(db, member_id)
    if not member:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Member not found"
        )
    return member