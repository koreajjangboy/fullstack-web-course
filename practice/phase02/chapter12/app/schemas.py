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

# 3. 회원 부분 수정 스키마 (PATCH) - 명시적 null 허용 안 함 (Optional 타입으로 지정하여 생략은 허용하되 null이 들어오면 검증 실패 유도)
class MemberPatch(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=50)
    email: Optional[EmailStr] = None
    age: Optional[int] = Field(None, ge=0, le=150)

# 4. 회원 응답 스키마
class MemberResponse(BaseModel):
    member_id: int
    name: str
    email: EmailStr
    age: int

    class Config:
        from_attributes = True  # SQLAlchemy 모델 객체를 Pydantic 모델로 변환 허용 (v2 스타일)