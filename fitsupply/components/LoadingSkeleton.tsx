export const ProductCardSkeleton = () => (
  <div className='bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm animate-pulse'>
    <div className='h-56 bg-gray-200'></div>
    <div className='p-4'>
      <div className='h-6 bg-gray-200 rounded mb-2'></div>
      <div className='h-4 bg-gray-200 rounded w-2/3 mb-3'></div>
      <div className='flex justify-between items-center'>
        <div className='h-8 bg-gray-200 rounded w-1/3'></div>
        <div className='h-10 bg-gray-200 rounded w-1/4'></div>
      </div>
    </div>
  </div>
);
