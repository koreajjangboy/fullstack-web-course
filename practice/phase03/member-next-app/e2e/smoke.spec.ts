import { test, expect } from '@playwright/test';

// 테스트 전 올바른 미니 팝업스토어 페이지로 이동
test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3000/mini-popup-store');
  await page.waitForLoadState('networkidle');
});

test('Smoke ①: 팝업스토어 페이지 제목 및 상품 노출 검사', async ({ page }) => {
  // 헤더 타이틀 확인
  await expect(page.locator('h1:has-text("캠핑 팝업스토어 (상품 목록)")')).toBeVisible();
  
  // 첫 번째 상품 ("초코 쿠키") 카드 확인
  await expect(page.locator('text=초코 쿠키')).toBeVisible();
});

test('Smoke ②: 상품 담기 후 장바구니 총 수량 Badge 증가 검사', async ({ page }) => {
  // 초기 장바구니 총 수량 0개 확인
  const badge = page.locator('text=🛒 장바구니 총 수량: 0개');
  await expect(badge).toBeVisible();

  // 첫 번째 상품("초코 쿠키")의 "담기" 버튼 클릭
  const addButton = page.locator('button:has-text("담기")').first();
  await addButton.click();

  // 수량이 1개로 증가했는지 확인
  const updatedBadge = page.locator('text=🛒 장바구니 총 수량: 1개');
  await expect(updatedBadge).toBeVisible();
});

test('Test ③: 같은 상품(초코 쿠키)을 두 번 담았을 때 수량 2개 누적 검사', async ({ page }) => {
  const addButton = page.locator('button:has-text("담기")').first();
  
  // 2번 연속 클릭
  await addButton.click();
  await addButton.click();

  // 총 수량이 2개로 표시되는지 확인
  const badge = page.locator('text=🛒 장바구니 총 수량: 2개');
  await expect(badge).toBeVisible();
});

test('Test ④: 품절 상품(캠핑 드립 커피백)의 비활성화 상태 검사', async ({ page }) => {
  // "캠핑 드립 커피백"은 stock: 0 이므로 품절 버튼이 활성화되어 있어야 함
  const soldOutButton = page.locator('button:has-text("품절")').first();
  await expect(soldOutButton).toBeVisible();
  await expect(soldOutButton).toBeDisabled();
});

test('Test ⑤: 서로 다른 상품 여러 개 담았을 때 총 수량 합산 검사', async ({ page }) => {
  const addButtons = page.locator('button:has-text("담기")');
  
  // 첫 번째 상품 담기 (초코 쿠키)
  await addButtons.nth(0).click();
  // 두 번째 활성화된 상품 담기 (접이식 캠핑 체어 - 품절인 드립 커피백 제외)
  await addButtons.nth(1).click(); 

  // 총 수량이 2개가 되었는지 확인
  const badge = page.locator('text=🛒 장바구니 총 수량: 2개');
  await expect(badge).toBeVisible();
});