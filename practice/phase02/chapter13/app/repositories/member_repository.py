from sqlalchemy.orm import Session
from app.models import Member
from app.schemas import MemberCreate, MemberUpdate, MemberPatch

# 1. 전체 회원 조회
def find_all(db: Session):
    return db.query(Member).all()

# 2. ID로 회원 조회
def find_by_id(db: Session, member_id: int):
    return db.query(Member).filter(Member.member_id == member_id).first()

# 3. 이메일로 회원 조회 (중복 검증용)
def find_by_email(db: Session, email: str):
    return db.query(Member).filter(Member.email == email).first()

# 4. 회원 생성
def create_member(db: Session, payload: MemberCreate):
    db_member = Member(
        name=payload.name,
        email=payload.email,
        age=payload.age
    )
    db.add(db_member)
    db.commit()
    db.refresh(db_member)
    return db_member

# 5. 전체 수정 (PUT)
def update_member(db: Session, member: Member, payload: MemberUpdate):
    member.name = payload.name
    member.email = payload.email
    member.age = payload.age
    db.commit()
    db.refresh(member)
    return member

# 6. 부분 수정 (PATCH)
def patch_member(db: Session, member: Member, payload: MemberPatch):
    changes = payload.model_dump(exclude_unset=True)
    for key, value in changes.items():
        setattr(member, key, value)
    db.commit()
    db.refresh(member)
    return member

# 7. 회원 삭제
def delete_member(db: Session, member: Member):
    db.delete(member)
    db.commit()