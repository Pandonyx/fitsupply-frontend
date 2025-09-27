interface ProductsFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filterCategory: string;
  setFilterCategory: (value: string) => void;
  filterStatus: string;
  setFilterStatus: (value: string) => void;
  categories: string[];
  onClearFilters: () => void;
}

export default function ProductsFilters({
  searchTerm,
  setSearchTerm,
  filterCategory,
  setFilterCategory,
  filterStatus,
  setFilterStatus,
  categories,
  onClearFilters,
}: ProductsFiltersProps) {
  return (
    <div className='bg-white p-6 rounded-lg shadow'>
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Search Products
          </label>
          <input
            type='text'
            placeholder='Search by name or SKU...'
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Category
          </label>
          <select
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}>
            {categories.map((cat) => (
              <option
                key={cat}
                value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Status
          </label>
          <select
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}>
            <option value='All'>All Status</option>
            <option value='Active'>Active</option>
            <option value='Inactive'>Inactive</option>
            <option value='Featured'>Featured</option>
            <option value='Low Stock'>Low Stock</option>
          </select>
        </div>
        <div className='flex items-end'>
          <button
            onClick={onClearFilters}
            className='w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors'>
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
}
