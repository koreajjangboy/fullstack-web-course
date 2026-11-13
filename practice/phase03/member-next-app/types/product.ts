export type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  stock: number;
};

// 👇 추가된 부분: Product 속성에 quantity(수량)가 포함된 타입
export type CartItem = Product & {
  quantity: number;
};