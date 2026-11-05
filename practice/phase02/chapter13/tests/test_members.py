from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_get_members_returns_200():
    response = client.get("/members")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

# 404 예외 검증 테스트 추가
def test_get_unknown_member_returns_404():
    response = client.get("/members/999999")
    assert response.status_code == 404
    assert response.json()["detail"] == "Member not found"