from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_get_products_success():
    """GET /products 요청 시 200 OK와 올바른 상품 목록 형식을 반환하는지 검증합니다."""
    response = client.get("/products")
    
    # 1. HTTP Status Code 200 검증
    assert response.status_code == 200
    
    # 2. 응답 데이터가 JSON 배열 형태인지 검증
    data = response.json()
    assert isinstance(data, list)
    
    # 3. 데이터가 존재할 경우 각 상품의 필드 및 타입 계약 검증
    if len(data) > 0:
        product = data[0]
        assert "id" in product and isinstance(product["id"], int)
        assert "name" in product and isinstance(product["name"], str)
        assert "price" in product and isinstance(product["price"], int)
        assert "category" in product and isinstance(product["category"], str)
        assert "stock" in product and isinstance(product["stock"], int)