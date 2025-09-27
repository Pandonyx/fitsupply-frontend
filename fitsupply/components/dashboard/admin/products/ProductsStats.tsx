import { Product } from "@/interfaces";

interface ProductsStatsProps {
  products: Product[];
}

export default function ProductsStats({ products }: ProductsStatsProps) {
  const stats = {
    total: products.length,
    active: products.filter((p) => p.is_active).length,
    featured: products.filter((p) => p.is_featured).length,
    lowStock: products.filter((p) => p.stock_quantity <= p.low_stock_threshold)
      .length,
  };

  return (
    <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
      <div className='bg-white p-6 rounded-lg shadow'>
        <h3 className='text-sm font-medium text-gray-500'>Total Products</h3>
        <p className='text-2xl font-bold text-gray-900'>{stats.total}</p>
      </div>
      <div className='bg-white p-6 rounded-lg shadow'>
        <h3 className='text-sm font-medium text-gray-500'>Active Products</h3>
        <p className='text-2xl font-bold text-green-600'>{stats.active}</p>
      </div>
      <div className='bg-white p-6 rounded-lg shadow'>
        <h3 className='text-sm font-medium text-gray-500'>Featured Products</h3>
        <p className='text-2xl font-bold text-blue-600'>{stats.featured}</p>
      </div>
      <div className='bg-white p-6 rounded-lg shadow'>
        <h3 className='text-sm font-medium text-gray-500'>Low Stock Items</h3>
        <p className='text-2xl font-bold text-red-600'>{stats.lowStock}</p>
      </div>
    </div>
  );
}
