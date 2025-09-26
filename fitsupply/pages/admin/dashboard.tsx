import AdminLayout from "@/components/AdminLayout";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { fetchDashboardSummary } from "@/store/slices/dashboardSlice";
import SummaryCards from "@/components/dashboard/SummaryCards";
import SalesChart from "@/components/dashboard/SalesChart";
import RecentOrders from "@/components/dashboard/RecentOrders";

const AdminDashboardPage = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // Initialize dashboard data
    dispatch(fetchDashboardSummary());
  }, [dispatch]);

  return (
    <AdminLayout>
      <div className='space-y-6'>
        {/* Header */}
        <div className='border-b border-gray-200 pb-4'>
          <h1 className='text-3xl font-bold text-gray-900'>Dashboard</h1>
          <p className='mt-1 text-sm text-gray-600'>
            Welcome back! Here's what's happening with your store today.
          </p>
        </div>

        {/* Summary Cards */}
        <SummaryCards />

        {/* Charts and Analytics */}
        <div className='grid grid-cols-1 xl:grid-cols-3 gap-6'>
          {/* Sales Chart - Takes up 2/3 of the width */}
          <div className='xl:col-span-2'>
            <SalesChart />
          </div>

          {/* Quick Stats - Takes up 1/3 of the width */}
          <div className='space-y-6'>
            <div className='bg-white p-6 rounded-lg shadow'>
              <h3 className='text-lg font-medium text-gray-900 mb-4'>
                Quick Stats
              </h3>
              <div className='space-y-4'>
                <div className='flex justify-between items-center'>
                  <span className='text-sm text-gray-600'>Products</span>
                  <span className='text-sm font-medium text-gray-900'>124</span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-sm text-gray-600'>Categories</span>
                  <span className='text-sm font-medium text-gray-900'>8</span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-sm text-gray-600'>Total Customers</span>
                  <span className='text-sm font-medium text-gray-900'>
                    1,234
                  </span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-sm text-gray-600'>
                    Avg. Order Value
                  </span>
                  <span className='text-sm font-medium text-gray-900'>
                    $87.50
                  </span>
                </div>
              </div>
            </div>

            <div className='bg-white p-6 rounded-lg shadow'>
              <h3 className='text-lg font-medium text-gray-900 mb-4'>
                Quick Actions
              </h3>
              <div className='space-y-3'>
                <button className='w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors'>
                  Add New Product
                </button>
                <button className='w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors'>
                  Process Orders
                </button>
                <button className='w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors'>
                  View Analytics
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <RecentOrders />

        {/* Additional Dashboard Widgets */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {/* Top Products */}
          <div className='bg-white p-6 rounded-lg shadow'>
            <h3 className='text-lg font-medium text-gray-900 mb-4'>
              Top Selling Products
            </h3>
            <div className='space-y-3'>
              {[
                { name: "Whey Protein Powder", sales: 45 },
                { name: "Creatine Monohydrate", sales: 32 },
                { name: "BCAA Supplement", sales: 28 },
                { name: "Pre-Workout Formula", sales: 24 },
                { name: "Multivitamin", sales: 19 },
              ].map((product, index) => (
                <div
                  key={index}
                  className='flex justify-between items-center'>
                  <span className='text-sm text-gray-900'>{product.name}</span>
                  <span className='text-sm font-medium text-gray-600'>
                    {product.sales} sold
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className='bg-white p-6 rounded-lg shadow'>
            <h3 className='text-lg font-medium text-gray-900 mb-4'>
              Recent Activity
            </h3>
            <div className='space-y-3'>
              {[
                {
                  action: "New order received",
                  time: "2 minutes ago",
                  type: "order",
                },
                {
                  action: "Product stock updated",
                  time: "15 minutes ago",
                  type: "product",
                },
                {
                  action: "Customer registered",
                  time: "1 hour ago",
                  type: "customer",
                },
                {
                  action: "Payment processed",
                  time: "2 hours ago",
                  type: "payment",
                },
                {
                  action: "Review submitted",
                  time: "3 hours ago",
                  type: "review",
                },
              ].map((activity, index) => (
                <div
                  key={index}
                  className='flex items-start space-x-3'>
                  <div
                    className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                      activity.type === "order"
                        ? "bg-green-400"
                        : activity.type === "product"
                        ? "bg-blue-400"
                        : activity.type === "customer"
                        ? "bg-purple-400"
                        : activity.type === "payment"
                        ? "bg-yellow-400"
                        : "bg-gray-400"
                    }`}></div>
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm text-gray-900'>{activity.action}</p>
                    <p className='text-xs text-gray-500'>{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;
