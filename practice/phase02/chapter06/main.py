from fastapi import FastAPI, status
from pydantic import BaseModel
from database import get_connection

app = FastAPI()

class MemberResponse(BaseModel):
    member_id: int
    name: str
    email: str
    age: int

@app.get("/members", response_model=list[MemberResponse])
def get_members():
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT member_id, name, email, age
                FROM members
                ORDER BY member_id
                """
            )
            members = cur.fetchall()
    return members

@app.post("/members", response_model=MemberResponse, status_code=status.HTTP_201_CREATED)
def set_members(member: MemberResponse):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO members (name, email, age)
                VALUES (%s, %s, %s)
                RETURNING member_id, name, email, age;
                """,
                (member.name, member.email, member.age)
            )
            new_member = cur.fetchone()
            conn.commit()  # 데이터 변경 사항을 DB에 영구 반영
            
    return new_member