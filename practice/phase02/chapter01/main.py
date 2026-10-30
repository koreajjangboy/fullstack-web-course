from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello FastAPI from JB"}

@app.get("/jb")
def read_jb():
    return {"message": "JB makes Hi-Fi"}

members = [
    {"id": 1, "name": "Kim", "email": "kim@example.com"},
    {"id": 2, "name": "Lee", "email": "lee@example.com"},
]

@app.get("/members")
def read_members():
    return members