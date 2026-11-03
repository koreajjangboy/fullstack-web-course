from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel, EmailStr, Field
from common.db import get_connection

app = FastAPI()

class MemberCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    age: int = Field(ge=0, le=150)

class MemberResponse(MemberCreate):
    member_id: int

@app.post(
    "/members",
    response_model=MemberResponse,
    status_code=status.HTTP_201_CREATED
)
def create_member(member: MemberCreate):
    conn = get_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute(
                "SELECT member_id FROM members WHERE email = %s",
                (member.email,)
            )
            if cursor.fetchone():
                raise HTTPException(
                    status_code=409,
                    detail="이미 등록된 이메일입니다."
                )
            cursor.execute(
                """
                INSERT INTO members (name, email, age)
                VALUES (%s, %s, %s)
                RETURNING member_id, name, email, age
                """,
                (member.name, member.email, member.age)
            )
            row = cursor.fetchone()
            
            conn.commit()
            return {
                "member_id": row[0],
                "name": row[1],
                "email": row[2],
                "age": row[3]
            }
    except HTTPException:
        conn.rollback()
        raise
    except Exception:
        conn.rollback()
        raise HTTPException(
            status_code=500,
            detail="회원 등록 중 오류가 발생했습니다."
        )
    finally:
        conn.close()