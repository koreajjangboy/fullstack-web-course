from pydantic import BaseModel, EmailStr, Field
from typing import Optional

# 1. 회원 생성 스키마
class MemberCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=50)
    email: EmailStr
    age: int = Field(..., ge=0, le=150)

# 2. 회원 전체 수정 스키마 (PUT)
class MemberUpdate(BaseModel):
    name: str = Field(..., min_length=1, max_length=50)
    email: EmailStr
    age: int = Field(..., ge=0, le=150)

# 3. 회원 부분 수정 스키마 (PATCH)
class MemberPatch(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=50)
    email: Optional[EmailStr] = None
    age: Optional[int] = Field(None, ge=0, le=150)

# 4. 회원 응답 스키마 (MemberResponse)
class MemberResponse(BaseModel):
    member_id: int
    name: str
    email: EmailStr
    age: int

    class Config:
        from_attributes = True