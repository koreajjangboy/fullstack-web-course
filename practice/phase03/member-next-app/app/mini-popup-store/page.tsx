"use client";

import React, { useState } from "react";
import ProductCard from "@/components/ProductCard";
import { Product, CartItem } from "@/types/product";

export default function StorePage() {
  const [cart, setCart] = useState<CartItem[]>([]);

  const dummyProducts: Product[] = [
    { id: 1, name: "초코 쿠키", price: 3000, category: "간식", stock: 15 },
    { id: 2, name: "캠핑 드립 커피백", price: 6000, category: "음료", stock: 0 },
    { id: 3, name: "접이식 캠핑 체어", price: 35000, category: "장비", stock: 8 },
    { id: 4, name: "LED 랜턴", price: 18000, category: "조명", stock: 12 },
    { id: 5, name: "티타늄 시라컵", price: 12000, category: "식기", stock: 20 },
    { id: 6, name: "방수 텐트 매트", price: 25000, category: "장비", stock: 5 },
  ];

  // 장바구니 담기 핸들러 (신규 추가 또는 기존 수량 증가)
  const handleAdd = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);

      if (existingItem) {
        if (existingItem.quantity >= product.stock) {
          alert(`"${product.name}" 상품의 재고가 부족합니다. (최대 재고: ${product.stock}개)`);
          return prevCart;
        }
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        if (product.stock <= 0) {
          alert(`"${product.name}" 상품은 품절되었습니다.`);
          return prevCart;
        }
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  // STEP 22: 장바구니 수량 증감 핸들러 (+ / - 버튼 연동)
  const handleUpdateQuantity = (productId: number, delta: number) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.id === productId) {
            const newQuantity = item.quantity + delta;
            // + 버튼 시 재고 상한 체크
            if (delta > 0 && newQuantity > item.stock) {
              alert(`"${item.name}" 상품의 최대 재고는 ${item.stock}개입니다.`);
              return item;
            }
            return { ...item, quantity: newQuantity };
          }
          return item;
        })
        .filter((item) => item.quantity > 0); // quantity가 0 이하가 되면 배열에서 제거
    });
  };

  // 파생 상태(Derived State): 총 수량 합계 계산
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <main className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          캠핑 팝업스토어 (상품 목록)
        </h1>
        {/* 장바구니 총 수량 Badge */}
        <div className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold text-sm shadow-md">
          🛒 장바구니 총 수량: {totalQuantity}개
        </div>
      </div>

      {/* 장바구니 목록 영역 (수량 조절 UI 포함) */}
      <div className="mb-8 p-4 bg-gray-50 border rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-3 text-gray-700">📦 장바구니 목록</h2>
        {cart.length === 0 ? (
          <p className="text-sm text-gray-500">장바구니가 비어 있습니다.</p>
        ) : (
          <ul className="space-y-2">
            {cart.map((item) => (
              <li key={item.id} className="flex justify-between items-center bg-white p-3 rounded border shadow-sm">
                <div>
                  <span className="font-medium">{item.name}</span>
                  <span className="text-sm text-gray-500 ml-2">({item.price.toLocaleString()}원)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1 border rounded px-2 py-1">
                    {/* - 버튼 (1개일 때 누르면 filter에 의해 제거됨) */}
                    <button
                      onClick={() => handleUpdateQuantity(item.id, -1)}
                      className="px-2 text-gray-600 hover:bg-gray-100 rounded font-bold"
                    >
                      -
                    </button>
                    <span className="px-2 text-sm font-semibold">{item.quantity}</span>
                    {/* + 버튼 (재고 이내로만 증가) */}
                    <button
                      onClick={() => handleUpdateQuantity(item.id, 1)}
                      className="px-2 text-gray-600 hover:bg-gray-100 rounded font-bold"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-sm font-bold text-blue-600">
                    {(item.price * item.quantity).toLocaleString()}원
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      {/* 6개 상품 카드 그리드 렌더링 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
        {dummyProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAdd={handleAdd}
          />
        ))}
      </div>
    </main>
  );
}