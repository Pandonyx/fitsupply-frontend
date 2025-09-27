interface ProductsHeaderProps {
  onAddProduct: () => void;
}

export default function ProductsHeader({ onAddProduct }: ProductsHeaderProps) {
  return (
    <div className='flex justify-between items-center'>
      <div>
        <h1 className='text-3xl font-bold text-gray-900'>Product Management</h1>
        <p className='text-gray-600'>
          Manage your store inventory and product catalog
        </p>
      </div>
      <button
        onClick={onAddProduct}
        className='bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium'>
        Add New Product
      </button>
    </div>
  );
}
