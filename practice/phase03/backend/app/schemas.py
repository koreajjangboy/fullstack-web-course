from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Literal
from datetime import datetime

# ==========================================
# 1. 회원 관리 스키마 (기존 템플릿 유지)
# ==========================================
class MemberCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=50)
    email: EmailStr
    age: int = Field(..., ge=0, le=150)
    gender: Literal["남", "녀"] = Field(..., description="성별 ('남' 또는 '녀')")

class MemberUpdate(BaseModel):
    name: str = Field(..., min_length=1, max_length=50)
    email: EmailStr
    age: int = Field(..., ge=0, le=150)
    gender: Literal["남", "녀"] = Field(..., description="성별 ('남' 또는 '녀')")

class MemberPatch(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=50)
    email: Optional[EmailStr] = None
    age: Optional[int] = Field(None, ge=0, le=150)
    gender: Optional[Literal["남", "녀"]] = Field(None, description="성별 ('남' 또는 '녀')")

class MemberResponse(BaseModel):
    member_id: int
    name: str
    email: EmailStr
    age: int
    gender: str

    model_config = {
        "from_attributes": True
    }


# ==========================================
# 2. 미니 팝업스토어 (상품 및 주문) 스키마
# ==========================================
class ProductResponse(BaseModel):
    id: int
    name: str
    price: int
    category: str
    stock: int

    model_config = {
        "from_attributes": True
    }

class OrderItemCreate(BaseModel):
    product_id: int = Field(..., gt=0, description="주문할 상품 ID")
    quantity: int = Field(..., ge=1, description="주문 수량 (최소 1개 이상)")

class OrderCreate(BaseModel):
    items: List[OrderItemCreate] = Field(..., min_items=1, description="주문 상품 목록")

class OrderItemResponse(BaseModel):
    id: int
    product_id: int
    quantity: int
    price: int  # 주문 당시의 단가 스냅샷

    model_config = {
        "from_attributes": True
    }

class OrderResponse(BaseModel):
    id: int
    total_price: int
    status: str
    created_at: datetime
    items: List[OrderItemResponse]

    model_config = {
        "from_attributes": True
    }