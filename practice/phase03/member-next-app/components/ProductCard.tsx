"use client";

import React from "react";
import { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
}

export default function ProductCard({ product, onAdd }: ProductCardProps) {
  const isSoldOut = product.stock === 0;

  return (
    <div className="border rounded-lg p-4 shadow-sm flex flex-col justify-between bg-white">
      <div>
        <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded">
          {product.category}
        </span>
        <h3 className="text-lg font-bold mt-2 text-gray-800">{product.name}</h3>
        <p className="text-xl font-semibold text-blue-600 mt-1">
          {product.price.toLocaleString()}원
        </p>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span
          className={`text-sm font-medium ${
            isSoldOut ? "text-red-500 font-bold" : "text-gray-600"
          }`}
        >
          {isSoldOut ? "품절" : `재고: ${product.stock}개`}
        </span>

        <button
          onClick={() => onAdd(product)}
          disabled={isSoldOut}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            isSoldOut
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800"
          }`}
        >
          {isSoldOut ? "품절" : "담기"}
        </button>
      </div>
    </div>
  );
}