from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import String, Integer
from app.db import Base

class Member(Base):
    __tablename__ = "members"

    member_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(50), nullable=False)
    email: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True)
    age: Mapped[int] = mapped_column(Integer, nullable=False)