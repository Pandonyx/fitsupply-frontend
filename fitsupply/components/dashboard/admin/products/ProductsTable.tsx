import Image from "next/image";
import { Product } from "@/interfaces";

interface ProductsTableProps {
  products: Product[];
  onQuickEdit: (productId: number, field: string, value: any) => void;
  onEdit: (product: Product) => void;
  onDelete: (productId: number) => void;
}

export default function ProductsTable({
  products,
  onQuickEdit,
  onEdit,
  onDelete,
}: ProductsTableProps) {
  if (products.length === 0) {
    return (
      <div className='bg-white rounded-lg shadow p-8 text-center'>
        <div className='text-gray-400 mb-4'>
          <svg
            className='w-16 h-16 mx-auto'
            fill='currentColor'
            viewBox='0 0 20 20'>
            <path
              fillRule='evenodd'
              d='M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z'
              clipRule='evenodd'
            />
          </svg>
        </div>
        <h3 className='text-lg font-semibold text-gray-800 mb-2'>
          No products found
        </h3>
        <p className='text-gray-600'>
          Try adjusting your search or filter criteria
        </p>
      </div>
    );
  }

  return (
    <div className='bg-white rounded-lg shadow overflow-hidden'>
      <div className='overflow-x-auto'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Product
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                SKU
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Category
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Price
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Stock
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Status
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {products.map((product) => (
              <tr
                key={product.id}
                className='hover:bg-gray-50'>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='flex items-center'>
                    <div className='flex-shrink-0 h-12 w-12'>
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={48}
                          height={48}
                          className='h-12 w-12 rounded-lg object-cover'
                        />
                      ) : (
                        <div className='h-12 w-12 bg-gray-200 rounded-lg flex items-center justify-center'>
                          <span className='text-gray-400 text-xs'>
                            No Image
                          </span>
                        </div>
                      )}
                    </div>
                    <div className='ml-4'>
                      <div className='text-sm font-medium text-gray-900'>
                        {product.name}
                      </div>
                      <div className='text-sm text-gray-500 max-w-xs truncate'>
                        {product.short_description || product.description}
                      </div>
                    </div>
                  </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                  {product.sku}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                  {product.category?.name}
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <input
                    type='number'
                    step='0.01'
                    className='w-20 px-2 py-1 border border-gray-300 rounded text-sm'
                    defaultValue={product.price}
                    onBlur={(e) =>
                      onQuickEdit(product.id, "price", e.target.value)
                    }
                  />
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='flex items-center space-x-2'>
                    <input
                      type='number'
                      className='w-16 px-2 py-1 border border-gray-300 rounded text-sm'
                      defaultValue={product.stock_quantity}
                      onBlur={(e) =>
                        onQuickEdit(
                          product.id,
                          "stock_quantity",
                          parseInt(e.target.value)
                        )
                      }
                    />
                    {product.stock_quantity <= product.low_stock_threshold && (
                      <span className='inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800'>
                        Low Stock
                      </span>
                    )}
                  </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='flex flex-col space-y-1'>
                    <label className='flex items-center'>
                      <input
                        type='checkbox'
                        checked={product.is_active}
                        onChange={(e) =>
                          onQuickEdit(product.id, "is_active", e.target.checked)
                        }
                        className='mr-2'
                      />
                      <span className='text-sm'>Active</span>
                    </label>
                    <label className='flex items-center'>
                      <input
                        type='checkbox'
                        checked={product.is_featured}
                        onChange={(e) =>
                          onQuickEdit(
                            product.id,
                            "is_featured",
                            e.target.checked
                          )
                        }
                        className='mr-2'
                      />
                      <span className='text-sm'>Featured</span>
                    </label>
                  </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                  <div className='flex space-x-2'>
                    <button
                      onClick={() => onEdit(product)}
                      className='text-indigo-600 hover:text-indigo-900'>
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(product.id)}
                      className='text-red-600 hover:text-red-900'>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
