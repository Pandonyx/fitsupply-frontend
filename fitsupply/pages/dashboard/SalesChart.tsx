import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { AppDispatch, RootState } from "@/store";
import { fetchSalesChartData } from "@/pages/dashboard/dashboardSlice";

const SalesChart = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { salesChartData } = useSelector((state: RootState) => state.dashboard);

  useEffect(() => {
    dispatch(fetchSalesChartData());
  }, [dispatch]);

  return (
    <div
      className='bg-white p-6 rounded-lg shadow-md mt-8'
      style={{ height: 400 }}>
      <h2 className='text-xl font-semibold mb-4'>Sales Over Time</h2>
      <ResponsiveContainer
        width='100%'
        height='100%'>
        <LineChart data={salesChartData}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='date' />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type='monotone'
            dataKey='sales'
            stroke='#8884d8'
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesChart;
