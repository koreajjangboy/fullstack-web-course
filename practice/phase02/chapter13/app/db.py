from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# SQLite 데이터베이스 파일 경로 설정 (chapter13 폴더 내에 test.db 생성)
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, 
    connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(
    autocommit=False, 
    autoflush=False, 
    bind=engine
)

Base = declarative_base()

# FastAPI 의존성 주입(Depends)용 get_db 함수
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()