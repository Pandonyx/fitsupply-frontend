import { useSelector } from "react-redux";
import { RootState } from "@/store";

const SummaryCards = () => {
  const { summary, status, error } = useSelector(
    (state: RootState) => state.dashboard
  );

  if (status === "loading") return <p>Loading summary...</p>;
  if (status === "failed")
    return <p className='text-red-500'>Error: {error}</p>;

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
      <div className='bg-white p-6 rounded-lg shadow-md'>
        <h2 className='text-xl font-semibold mb-2'>Total Sales</h2>
        <p className='text-3xl font-bold text-green-600'>
          ${summary?.total_sales.toFixed(2) ?? "0.00"}
        </p>
        <p className='text-gray-500'>All time</p>
      </div>
      <div className='bg-white p-6 rounded-lg shadow-md'>
        <h2 className='text-xl font-semibold mb-2'>New Orders</h2>
        <p className='text-3xl font-bold text-blue-600'>
          {summary?.new_orders ?? 0}
        </p>
        <p className='text-gray-500'>All time</p>
      </div>
      <div className='bg-white p-6 rounded-lg shadow-md'>
        <h2 className='text-xl font-semibold mb-2'>New Customers</h2>
        <p className='text-3xl font-bold text-purple-600'>
          {summary?.new_customers ?? 0}
        </p>
        <p className='text-gray-500'>All time</p>
      </div>
    </div>
  );
};

export default SummaryCards;
