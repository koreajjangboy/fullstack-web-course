from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, CheckConstraint
from sqlalchemy.sql import func
from app.db import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(120), nullable=False)
    price = Column(Integer, nullable=False)
    category = Column(String(60), nullable=False)
    stock = Column(Integer, nullable=False)

    __table_args__ = (
        CheckConstraint('price >= 0', name='check_product_price_non_negative'),
        CheckConstraint('stock >= 0', name='check_product_stock_non_negative'),
    )

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    total_price = Column(Integer, nullable=False)
    status = Column(String(50), nullable=False, default="created")
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    __table_args__ = (
        CheckConstraint('total_price >= 0', name='check_order_total_price_non_negative'),
    )

class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    order_id = Column(Integer, ForeignKey("orders.id", ondelete="CASCADE"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    quantity = Column(Integer, nullable=False)
    price = Column(Integer, nullable=False) # 주문 당시의 단가 스냅샷

    __table_args__ = (
        CheckConstraint('quantity >= 1', name='check_order_item_quantity_min_one'),
        CheckConstraint('price >= 0', name='check_order_item_price_non_negative'),
    )