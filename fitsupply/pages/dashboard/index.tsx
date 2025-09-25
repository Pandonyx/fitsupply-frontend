import AdminLayout from "@/components/AdminLayout";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { fetchDashboardSummary } from "@/pages/dashboard/dashboardSlice";
import SummaryCards from "@/components/dashboard/SummaryCards";
import SalesChart from "@/components/dashboard/SalesChart";
import RecentOrders from "@/components/dashboard/RecentOrders";

const AdminDashboardPage = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // Fetch the main summary data for the cards
    dispatch(fetchDashboardSummary());
  }, [dispatch]);

  return (
    <AdminLayout>
      <h1 className='text-3xl font-bold'>Dashboard</h1>
      <div className='mt-6'>
        <SummaryCards />
        <SalesChart />
        <RecentOrders />
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;
