import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchRecentOrders } from "@/pages/dashboard/dashboardSlice";

const RecentOrders = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { recentOrders } = useSelector((state: RootState) => state.dashboard);

  useEffect(() => {
    dispatch(fetchRecentOrders());
  }, [dispatch]);

  return (
    <div className='bg-white p-6 rounded-lg shadow-md mt-8'>
      <h2 className='text-xl font-semibold mb-4'>Recent Orders</h2>
      <div className='overflow-x-auto'>
        <table className='min-w-full bg-white'>
          <thead>
            <tr>
              <th className='py-2 px-4 border-b text-left'>Order ID</th>
              <th className='py-2 px-4 border-b text-left'>Customer</th>
              <th className='py-2 px-4 border-b text-left'>Total</th>
              <th className='py-2 px-4 border-b text-left'>Status</th>
              <th className='py-2 px-4 border-b text-left'>Date</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order) => (
              <tr key={order.id}>
                <td className='py-2 px-4 border-b'>#{order.id}</td>
                <td className='py-2 px-4 border-b'>{order.customer_name}</td>
                <td className='py-2 px-4 border-b'>
                  ${order.total.toFixed(2)}
                </td>
                <td className='py-2 px-4 border-b'>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      order.status === "Completed"
                        ? "bg-green-200 text-green-800"
                        : "bg-yellow-200 text-yellow-800"
                    }`}>
                    {order.status}
                  </span>
                </td>
                <td className='py-2 px-4 border-b'>
                  {new Date(order.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrders;
