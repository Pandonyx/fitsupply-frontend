import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { RootState, AppDispatch } from "@/store";
import { fetchDashboardSummary } from "@/store/slices/dashboardSlice";

const SummaryCards = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { summary, status, error } = useSelector(
    (state: RootState) => state.dashboard
  );

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchDashboardSummary());
    }
  }, [dispatch, status]);

  if (status === "loading") {
    return (
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className='bg-white p-6 rounded-lg shadow animate-pulse'>
            <div className='h-4 bg-gray-200 rounded w-3/4 mb-2'></div>
            <div className='h-8 bg-gray-200 rounded w-1/2'></div>
          </div>
        ))}
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
        <div className='bg-white p-6 rounded-lg shadow'>
          <h3 className='text-sm font-medium text-gray-500'>Total Sales</h3>
          <p className='text-2xl font-bold text-gray-900'>$0.00</p>
          <p className='text-xs text-red-500 mt-1'>Unable to load data</p>
        </div>
        <div className='bg-white p-6 rounded-lg shadow'>
          <h3 className='text-sm font-medium text-gray-500'>New Orders</h3>
          <p className='text-2xl font-bold text-gray-900'>0</p>
          <p className='text-xs text-red-500 mt-1'>Unable to load data</p>
        </div>
        <div className='bg-white p-6 rounded-lg shadow'>
          <h3 className='text-sm font-medium text-gray-500'>New Customers</h3>
          <p className='text-2xl font-bold text-gray-900'>0</p>
          <p className='text-xs text-red-500 mt-1'>Unable to load data</p>
        </div>
      </div>
    );
  }

  // Use real data if available, otherwise show mock data
  const mockData = {
    total_sales: 12450.75,
    new_orders: 23,
    new_customers: 8,
  };

  const data = summary || mockData;

  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
      <div className='bg-white p-6 rounded-lg shadow'>
        <div className='flex items-center'>
          <div className='flex-1'>
            <h3 className='text-sm font-medium text-gray-500'>Total Sales</h3>
            <p className='text-2xl font-bold text-gray-900'>
              $
              {data.total_sales.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </p>
            <p className='text-xs text-green-600 mt-1'>+12% from last month</p>
          </div>
          <div className='flex-shrink-0'>
            <svg
              className='h-8 w-8 text-green-500'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1'
              />
            </svg>
          </div>
        </div>
      </div>

      <div className='bg-white p-6 rounded-lg shadow'>
        <div className='flex items-center'>
          <div className='flex-1'>
            <h3 className='text-sm font-medium text-gray-500'>New Orders</h3>
            <p className='text-2xl font-bold text-gray-900'>
              {data.new_orders}
            </p>
            <p className='text-xs text-blue-600 mt-1'>+5 from yesterday</p>
          </div>
          <div className='flex-shrink-0'>
            <svg
              className='h-8 w-8 text-blue-500'
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
          </div>
        </div>
      </div>

      <div className='bg-white p-6 rounded-lg shadow'>
        <div className='flex items-center'>
          <div className='flex-1'>
            <h3 className='text-sm font-medium text-gray-500'>New Customers</h3>
            <p className='text-2xl font-bold text-gray-900'>
              {data.new_customers}
            </p>
            <p className='text-xs text-purple-600 mt-1'>+2 from yesterday</p>
          </div>
          <div className='flex-shrink-0'>
            <svg
              className='h-8 w-8 text-purple-500'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z'
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;
