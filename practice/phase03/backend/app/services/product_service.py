from sqlalchemy.orm import Session
from app.repositories.product_repository import ProductRepository
from app.popup_store_models import Product

class ProductService:
    def __init__(self, db: Session):
        self.repository = ProductRepository(db)

    def list_products(self) -> list[Product]:
        """상품 전체 목록 조회 업무 로직을 수행합니다."""
        return self.repository.get_all()