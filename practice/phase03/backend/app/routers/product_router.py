from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db import get_db
from app.services.product_service import ProductService
from app.schemas import ProductResponse

router = APIRouter(
    prefix="/products",
    tags=["Products"]
)

@router.get("", response_model=list[ProductResponse])
def get_products(db: Session = Depends(get_db)):
    """등록된 모든 상품 목록을 조회합니다."""
    service = ProductService(db)
    return service.list_products()