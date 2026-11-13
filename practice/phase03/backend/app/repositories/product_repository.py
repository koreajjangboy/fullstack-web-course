from sqlalchemy.orm import Session
from sqlalchemy import select
from app.popup_store_models import Product

class ProductRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self) -> list[Product]:
        """상품 전체 목록을 ID 오름차순으로 조회합니다."""
        statement = select(Product).order_by(Product.id)
        return list(self.db.scalars(statement).all())

    def get_by_id(self, product_id: int) -> Product | None:
        """특정 ID의 상품을 단건 조회합니다."""
        statement = select(Product).filter(Product.id == product_id)
        return self.db.scalars(statement).first()