export interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  salePrice?: number;
  currency?: string;
  images: string[];
  shortDescription?: string;
  description?: string;
  category?: string;
  rating?: number;
  stock?: number;
}
export interface CartItem {
  productId: string;
  qty: number;
  price: number;
  name: string;
  image?: string;
}
