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

// AdminLayout interfaces
interface AdminLayoutProps {
  children: React.ReactNode;
}

// AdminRoute interfaces
interface ProtectedRouteProps {
  children: React.ReactNode;
}

// CartSidebar interfaces
interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

// Layout interfaces
interface LayoutProps {
  children: React.ReactNode;
}

// ProductCard interfaces
interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    description: string;
    category: string;
    stock: number;
  };
}

// ProductGallery interfaces
interface ProductGalleryProps {
  images: string[];
}

// Dashboard Components interfaces
interface RecentActivityProps {
  activities: {
    id: string;
    type: string;
    description: string;
    timestamp: string;
  }[];
}

interface RecentOrdersProps {
  orders: {
    id: string;
    customer: string;
    date: string;
    status: string;
    total: number;
  }[];
}

interface SalesChartProps {
  data: {
    date: string;
    sales: number;
  }[];
}

interface SummaryCardProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
}

interface TopProductProps {
  products: {
    id: string;
    name: string;
    sales: number;
    revenue: number;
  }[];
}

// Admin Product Management interfaces
interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (product: ProductData) => void;
  onSuccess: () => void;
}

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  product: ProductData;
  onSubmit: (product: ProductData) => void;
}

interface ProductData {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image: string;
}

interface ProductsFiltersProps {
  onFilterChange: (filters: ProductFilters) => void;
}

interface ProductFilters {
  category: string;
  priceRange: [number, number];
  stockStatus: string;
}

export interface ProductsFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filterCategory: string;
  setFilterCategory: (value: string) => void;
  filterStatus: string;
  setFilterStatus: (value: string) => void;
  categories: string[];
  onClearFilters: () => void;
}

interface ProductsStatsProps {
  totalProducts: number;
  totalValue: number;
  lowStock: number;
}

interface ProductsTableProps {
  products: ProductData[];
  onEdit: (product: ProductData) => void;
  onDelete: (productId: string) => void;
}

// Export all interfaces
export type {
  AdminLayoutProps,
  ProtectedRouteProps,
  CartSidebarProps,
  LayoutProps,
  ProductCardProps,
  ProductGalleryProps,
  RecentActivityProps,
  RecentOrdersProps,
  SalesChartProps,
  SummaryCardProps,
  TopProductProps,
  AddProductModalProps,
  EditProductModalProps,
  ProductData,
  ProductsFiltersProps,
  ProductFilters,
  ProductsHeaderProps,
  ProductsStatsProps,
  ProductsTableProps,
};
