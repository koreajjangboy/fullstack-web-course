from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel, EmailStr, Field, model_validator
from psycopg.rows import dict_row
from common.db import get_connection

app = FastAPI()

# 1. 생성용 Schema (참조용)
class MemberCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    age: int = Field(ge=0, le=150)

# 2. 전체 수정용 Schema (PUT)
class MemberUpdate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    age: int = Field(ge=0, le=150)

# 3. 부분 수정용 Schema (PATCH) - 명시적 null 거부 로직 포함
class MemberPatch(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=100)
    email: EmailStr | None = None
    age: int | None = Field(default=None, ge=0, le=150)

    @model_validator(mode="after")
    def reject_explicit_null(self):
        for field in self.model_fields_set:
            if getattr(self, field) is None:
                raise ValueError(f"{field} cannot be null")
        return self

# 4. 응답용 Schema
class MemberResponse(MemberCreate):
    member_id: int


# --- [PUT] 전체 수정 엔드포인트 ---
@app.put("/members/{member_id}", response_model=MemberResponse, status_code=status.HTTP_200_OK)
def update_member_put(member_id: int, member: MemberUpdate):
    with get_connection() as conn:
        with conn.cursor(row_factory=dict_row) as cur:
            # 1. 회원 존재 확인 (404)
            cur.execute("SELECT member_id FROM members WHERE member_id = %s", (member_id,))
            if cur.fetchone() is None:
                raise HTTPException(status_code=404, detail="Member not found")
            
            # 2. 이메일 중복 확인 (409)
            cur.execute(
                """
                SELECT member_id
                FROM members
                WHERE email = %s AND member_id <> %s
                """,
                (str(member.email), member_id),
            )
            if cur.fetchone() is not None:
                raise HTTPException(status_code=409, detail="Email already exists")
            
            # 3. UPDATE 실행 및 RETURNING
            cur.execute(
                """
                UPDATE members
                SET name = %s,
                    email = %s,
                    age = %s
                WHERE member_id = %s
                RETURNING member_id, name, email, age
                """,
                (member.name, str(member.email), member.age, member_id),
            )
            updated = cur.fetchone()
            
            # 4. 트랜잭션 커밋
            conn.commit()
            return updated


# --- [PATCH] 부분 수정 엔드포인트 ---
@app.patch("/members/{member_id}", response_model=MemberResponse, status_code=status.HTTP_200_OK)
def patch_member(member_id: int, member: MemberPatch):
    changes = member.model_dump(exclude_unset=True)
    if not changes:
        raise HTTPException(status_code=400, detail="At least one field is required")
        
    with get_connection() as conn:
        with conn.cursor(row_factory=dict_row) as cur:
            # 1. 회원 존재 확인 (404)
            cur.execute(
                "SELECT member_id FROM members WHERE member_id = %s",
                (member_id,),
            )
            if cur.fetchone() is None:
                raise HTTPException(status_code=404, detail="Member not found")
                
            # 2. 이메일 중복 확인 (409)
            if "email" in changes:
                cur.execute(
                    """
                    SELECT member_id
                    FROM members
                    WHERE email = %s AND member_id <> %s
                    """,
                    (str(changes["email"]), member_id),
                )
                if cur.fetchone() is not None:
                    raise HTTPException(status_code=409, detail="Email already exists")
                    
            # 3. 허용한 컬럼만 조합하는 안전한 동적 UPDATE 쿼리 생성
            allowed_fields = {
                "name": "name",
                "email": "email",
                "age": "age",
            }
            
            set_parts = []
            values = []
            
            for field, value in changes.items():
                column = allowed_fields[field]
                set_parts.append(f"{column} = %s")
                values.append(str(value) if field == "email" else value)
                
            values.append(member_id)
            
            sql = f"""
                UPDATE members
                SET {', '.join(set_parts)}
                WHERE member_id = %s
                RETURNING member_id, name, email, age
            """
            
            cur.execute(sql, values)
            updated = cur.fetchone()
            
            # 4. 트랜잭션 커밋
            conn.commit()
            return updated