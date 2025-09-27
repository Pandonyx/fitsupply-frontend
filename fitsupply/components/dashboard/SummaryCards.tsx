// components/dashboard/SummaryCards.tsx
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { RootState, AppDispatch } from "@/store";
import { fetchDashboardSummary } from "@/store/slices/dashboardSlice";

interface DashboardSummary {
  total_sales: number;
  total_sales_previous: number;
  new_orders: number;
  new_orders_previous: number;
  new_customers: number;
  new_customers_previous: number;
  sales_change_percent: number;
  orders_change_percent: number;
  customers_change_percent: number;
}

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

  // Calculate percentage change
  const calculatePercentageChange = (
    current: number,
    previous: number
  ): number => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  // Format percentage display
  const formatPercentageChange = (
    change: number,
    timeframe: string = "last month"
  ) => {
    const isPositive = change >= 0;
    const color = isPositive ? "text-green-600" : "text-red-600";
    const symbol = isPositive ? "+" : "";
    return (
      <p className={`text-xs ${color} mt-1`}>
        {symbol}
        {change}% from {timeframe}
      </p>
    );
  };

  if (status === "loading") {
    return (
      <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className='bg-white p-6 rounded-lg shadow animate-pulse'>
            <div className='h-4 bg-gray-200 rounded w-3/4 mb-2'></div>
            <div className='h-8 bg-gray-200 rounded w-1/2 mb-2'></div>
            <div className='h-3 bg-gray-200 rounded w-2/3'></div>
          </div>
        ))}
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
        {["Total Sales", "Orders Today", "New Customers", "Revenue"].map(
          (title, index) => (
            <div
              key={index}
              className='bg-white p-6 rounded-lg shadow'>
              <h3 className='text-sm font-medium text-gray-500'>{title}</h3>
              <p className='text-2xl font-bold text-gray-900'>--</p>
              <p className='text-xs text-red-500 mt-1'>Unable to load data</p>
            </div>
          )
        )}
      </div>
    );
  }

  // Only use data from backend - no fallbacks or mock data
  if (!summary) {
    return (
      <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
        {[
          "Total Sales",
          "Orders Today",
          "New Customers",
          "Avg Order Value",
        ].map((title, index) => (
          <div
            key={index}
            className='bg-white p-6 rounded-lg shadow'>
            <h3 className='text-sm font-medium text-gray-500'>{title}</h3>
            <p className='text-2xl font-bold text-gray-900'>--</p>
            <p className='text-xs text-gray-500 mt-1'>No data available</p>
          </div>
        ))}
      </div>
    );
  }

  // Calculate percentages if not provided by API (with null checks)
  const salesChange =
    summary.sales_change_percent ||
    (summary.total_sales_previous > 0
      ? calculatePercentageChange(
          summary.total_sales,
          summary.total_sales_previous
        )
      : 0);

  const ordersChange =
    summary.orders_change_percent ||
    (summary.new_orders_previous > 0
      ? calculatePercentageChange(
          summary.new_orders,
          summary.new_orders_previous
        )
      : 0);

  const customersChange =
    summary.customers_change_percent ||
    (summary.new_customers_previous > 0
      ? calculatePercentageChange(
          summary.new_customers,
          summary.new_customers_previous
        )
      : 0);

  // Calculate average order value with safety check
  const avgOrderValue =
    summary.new_orders > 0 ? summary.total_sales / summary.new_orders : 0;

  return (
    <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
      {/* Total Sales */}
      <div className='bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow'>
        <div className='flex items-center'>
          <div className='flex-1'>
            <h3 className='text-sm font-medium text-gray-500'>Total Sales</h3>
            <p className='text-2xl font-bold text-gray-900'>
              $
              {summary.total_sales.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </p>
            {formatPercentageChange(salesChange)}
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

      {/* Orders Today/This Week */}
      <div className='bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow'>
        <div className='flex items-center'>
          <div className='flex-1'>
            <h3 className='text-sm font-medium text-gray-500'>Orders Today</h3>
            <p className='text-2xl font-bold text-gray-900'>
              {summary.new_orders}
            </p>
            {formatPercentageChange(ordersChange, "yesterday")}
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

      {/* New Customers */}
      <div className='bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow'>
        <div className='flex items-center'>
          <div className='flex-1'>
            <h3 className='text-sm font-medium text-gray-500'>New Customers</h3>
            <p className='text-2xl font-bold text-gray-900'>
              {summary.new_customers}
            </p>
            {formatPercentageChange(customersChange, "last week")}
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

      {/* Average Order Value */}
      <div className='bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow'>
        <div className='flex items-center'>
          <div className='flex-1'>
            <h3 className='text-sm font-medium text-gray-500'>
              Avg Order Value
            </h3>
            <p className='text-2xl font-bold text-gray-900'>
              $
              {avgOrderValue.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
            <p className='text-xs text-gray-500 mt-1'>
              Based on {summary.new_orders} orders
            </p>
          </div>
          <div className='flex-shrink-0'>
            <svg
              className='h-8 w-8 text-orange-500'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;
