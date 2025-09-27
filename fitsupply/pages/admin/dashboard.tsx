// pages/dashboard/admin/index.tsx
import AdminLayout from "@/components/AdminLayout";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { fetchDashboardSummary } from "@/store/slices/dashboardSlice";
import SummaryCards from "@/components/dashboard/SummaryCards";
import SalesChart from "@/components/dashboard/SalesChart";
import RecentOrders from "@/components/dashboard/RecentOrders";
import TopProducts from "@/components/dashboard/TopProducts";
import RecentActivity from "@/components/dashboard/RecentActivity";

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
                Order Status Overview
              </h3>
              <div className='space-y-4'>
                <div className='flex justify-between items-center'>
                  <div className='flex items-center'>
                    <div className='w-3 h-3 bg-yellow-400 rounded-full mr-2'></div>
                    <span className='text-sm text-gray-600'>Pending</span>
                  </div>
                  <span className='text-sm font-medium text-gray-900'>12</span>
                </div>
                <div className='flex justify-between items-center'>
                  <div className='flex items-center'>
                    <div className='w-3 h-3 bg-blue-400 rounded-full mr-2'></div>
                    <span className='text-sm text-gray-600'>Processing</span>
                  </div>
                  <span className='text-sm font-medium text-gray-900'>8</span>
                </div>
                <div className='flex justify-between items-center'>
                  <div className='flex items-center'>
                    <div className='w-3 h-3 bg-orange-400 rounded-full mr-2'></div>
                    <span className='text-sm text-gray-600'>Shipped</span>
                  </div>
                  <span className='text-sm font-medium text-gray-900'>15</span>
                </div>
                <div className='flex justify-between items-center'>
                  <div className='flex items-center'>
                    <div className='w-3 h-3 bg-green-400 rounded-full mr-2'></div>
                    <span className='text-sm text-gray-600'>Delivered</span>
                  </div>
                  <span className='text-sm font-medium text-gray-900'>34</span>
                </div>
              </div>
            </div>

            <div className='bg-white p-6 rounded-lg shadow'>
              <h3 className='text-lg font-medium text-gray-900 mb-4'>
                Inventory Alerts
              </h3>
              <div className='space-y-3'>
                <div className='flex items-center justify-between p-3 bg-red-50 rounded-lg'>
                  <div>
                    <p className='text-sm font-medium text-red-800'>
                      Low Stock
                    </p>
                    <p className='text-xs text-red-600'>
                      3 products below threshold
                    </p>
                  </div>
                  <button className='text-red-600 hover:text-red-800 text-sm font-medium'>
                    View
                  </button>
                </div>
                <div className='flex items-center justify-between p-3 bg-yellow-50 rounded-lg'>
                  <div>
                    <p className='text-sm font-medium text-yellow-800'>
                      Out of Stock
                    </p>
                    <p className='text-xs text-yellow-600'>
                      1 product unavailable
                    </p>
                  </div>
                  <button className='text-yellow-600 hover:text-yellow-800 text-sm font-medium'>
                    View
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <RecentOrders />

        {/* Additional Dashboard Widgets */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {/* Top Products */}
          <TopProducts />

          {/* Recent Activity */}
          <RecentActivity />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;
