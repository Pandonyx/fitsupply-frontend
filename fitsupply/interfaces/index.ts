export interface Product {
  id: number;
  slug: string;
  name: string;
  price: number;
  salePrice?: number;
  currency?: string;
  images: string[];
  shortDescription?: string;
  description?: string;
  category?: string;
  stock?: number;
}
export interface CartItem {
  productId: string;
  qty: number;
  price: number;
  name: string;
  image?: string;
}

export interface ProductCardProps {
  product: Product;
}
