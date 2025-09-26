import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { RootState, AppDispatch } from "@/store";
import { fetchRecentOrders } from "@/store/slices/dashboardSlice";

const RecentOrders = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { recentOrders, status } = useSelector(
    (state: RootState) => state.dashboard
  );

  useEffect(() => {
    dispatch(fetchRecentOrders());
  }, [dispatch]);

  // Mock data for development
  const mockOrders = [
    {
      id: 1,
      customer_name: "John Doe",
      total: 89.99,
      status: "completed",
      created_at: "2024-01-15T10:30:00Z",
    },
    {
      id: 2,
      customer_name: "Jane Smith",
      total: 156.5,
      status: "processing",
      created_at: "2024-01-15T09:15:00Z",
    },
    {
      id: 3,
      customer_name: "Mike Johnson",
      total: 234.75,
      status: "shipped",
      created_at: "2024-01-14T16:45:00Z",
    },
    {
      id: 4,
      customer_name: "Sarah Wilson",
      total: 67.25,
      status: "completed",
      created_at: "2024-01-14T14:20:00Z",
    },
    {
      id: 5,
      customer_name: "Alex Brown",
      total: 123.0,
      status: "processing",
      created_at: "2024-01-14T11:30:00Z",
    },
  ];

  const orders = recentOrders.length > 0 ? recentOrders : mockOrders;

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: { color: "bg-green-100 text-green-800", label: "Completed" },
      processing: {
        color: "bg-yellow-100 text-yellow-800",
        label: "Processing",
      },
      shipped: { color: "bg-blue-100 text-blue-800", label: "Shipped" },
      pending: { color: "bg-gray-100 text-gray-800", label: "Pending" },
      cancelled: { color: "bg-red-100 text-red-800", label: "Cancelled" },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

    return (
      <span
        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${config.color}`}>
        {config.label}
      </span>
    );
  };

  if (status === "loading") {
    return (
      <div className='bg-white rounded-lg shadow'>
        <div className='px-6 py-4 border-b border-gray-200'>
          <h3 className='text-lg font-medium text-gray-900'>Recent Orders</h3>
        </div>
        <div className='p-6'>
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className='flex items-center space-x-4 py-3 animate-pulse'>
              <div className='h-4 bg-gray-200 rounded w-8'></div>
              <div className='h-4 bg-gray-200 rounded w-32'></div>
              <div className='h-4 bg-gray-200 rounded w-20'></div>
              <div className='h-4 bg-gray-200 rounded w-16'></div>
              <div className='h-4 bg-gray-200 rounded w-24'></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className='bg-white rounded-lg shadow'>
      <div className='px-6 py-4 border-b border-gray-200'>
        <div className='flex justify-between items-center'>
          <h3 className='text-lg font-medium text-gray-900'>Recent Orders</h3>
          <button className='text-sm text-blue-600 hover:text-blue-800 font-medium'>
            View all orders
          </button>
        </div>
      </div>

      <div className='overflow-hidden'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Order
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Customer
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Status
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Total
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Date
              </th>
              <th className='relative px-6 py-3'>
                <span className='sr-only'>Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {orders.map((order) => (
              <tr
                key={order.id}
                className='hover:bg-gray-50'>
                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                  #{order.id}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                  {order.customer_name}
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  {getStatusBadge(order.status)}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium'>
                  ${order.total.toFixed(2)}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                  {new Date(order.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                  <button className='text-blue-600 hover:text-blue-900'>
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {orders.length === 0 && (
        <div className='p-6 text-center text-gray-500'>
          <svg
            className='mx-auto h-12 w-12 text-gray-400 mb-4'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z'
            />
          </svg>
          <p>No recent orders</p>
        </div>
      )}
    </div>
  );
};

export default RecentOrders;
