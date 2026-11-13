from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Literal

# 1. 회원 생성 스키마
class MemberCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=50)
    email: EmailStr
    age: int = Field(..., ge=0, le=150)
    gender: Literal["남", "녀"] = Field(..., description="성별 ('남' 또는 '녀')")

# 2. 회원 전체 수정 스키마 (PUT)
class MemberUpdate(BaseModel):
    name: str = Field(..., min_length=1, max_length=50)
    email: EmailStr
    age: int = Field(..., ge=0, le=150)
    gender: Literal["남", "녀"] = Field(..., description="성별 ('남' 또는 '녀')")

# 3. 회원 부분 수정 스키마 (PATCH)
class MemberPatch(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=50)
    email: Optional[EmailStr] = None
    age: Optional[int] = Field(None, ge=0, le=150)
    gender: Optional[Literal["남", "녀"]] = Field(None, description="성별 ('남' 또는 '녀')")

# 4. 회원 응답 스키마 (MemberResponse)
class MemberResponse(BaseModel):
    member_id: int
    name: str
    email: EmailStr
    age: int
    gender: str

    class Config:
        from_attributes = True