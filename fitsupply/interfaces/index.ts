export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: string;
  category:
    | {
        id: number;
        name: string;
        slug: string;
      }
    | string;
  stock_quantity: number;
  images?: string[];
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  productId: string;
  name: string;
  price: string;
  image?: string;
  qty: number;
}

export interface User {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  name?: string;
  is_staff?: boolean;
}

export interface Order {
  id: number;
  customer_name: string;
  total: number;
  status: string;
  created_at: string;
}
