from fastapi import FastAPI, HTTPException, status, Response
from pydantic import BaseModel, EmailStr, Field
from psycopg.rows import dict_row
from common.db import get_connection

app = FastAPI()

# 응답용 Schema
class MemberResponse(BaseModel):
    member_id: int
    name: str
    email: EmailStr
    age: int

# STEP 01. 삭제 전 회원 확인용 GET 단건 조회 API
@app.get("/members/{member_id}", response_model=MemberResponse, status_code=status.HTTP_200_OK)
def get_member(member_id: int):
    with get_connection() as conn:
        with conn.cursor(row_factory=dict_row) as cur:
            cur.execute(
                "SELECT member_id, name, email, age FROM members WHERE member_id = %s",
                (member_id,)
            )
            member = cur.fetchone()
            
            if member is None:
                raise HTTPException(status_code=404, detail="Member not found")
                
            return member

# STEP 02. 회원 삭제 DELETE API (RETURNING 및 204 No Content 적용)
@app.delete(
    "/members/{member_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_member(member_id: int):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                DELETE FROM members
                WHERE member_id = %s
                RETURNING member_id
                """,
                (member_id,),
            )
            deleted = cur.fetchone()
            
            if deleted is None:
                raise HTTPException(
                    status_code=404,
                    detail="Member not found",
                )
                
            conn.commit()
            
    return Response(status_code=status.HTTP_204_NO_CONTENT)