import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { RootState, AppDispatch } from "@/store";
import { fetchSalesChartData } from "@/store/slices/dashboardSlice";
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

const SalesChart = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { salesChartData, status } = useSelector(
    (state: RootState) => state.dashboard
  );

  useEffect(() => {
    dispatch(fetchSalesChartData());
  }, [dispatch]);

  // Mock data for development
  const mockChartData = [
    { date: "2024-01-01", sales: 2400 },
    { date: "2024-01-02", sales: 1398 },
    { date: "2024-01-03", sales: 9800 },
    { date: "2024-01-04", sales: 3908 },
    { date: "2024-01-05", sales: 4800 },
    { date: "2024-01-06", sales: 3800 },
    { date: "2024-01-07", sales: 4300 },
  ];

  const data = salesChartData.length > 0 ? salesChartData : mockChartData;

  if (status === "loading") {
    return (
      <div className='bg-white p-6 rounded-lg shadow mb-8'>
        <h3 className='text-lg font-medium text-gray-900 mb-4'>
          Sales Overview
        </h3>
        <div className='h-80 bg-gray-100 rounded animate-pulse'></div>
      </div>
    );
  }

  return (
    <div className='bg-white p-6 rounded-lg shadow mb-8'>
      <div className='flex justify-between items-center mb-4'>
        <h3 className='text-lg font-medium text-gray-900'>Sales Overview</h3>
        <div className='flex space-x-2'>
          <button className='px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded'>
            7 Days
          </button>
          <button className='px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded'>
            30 Days
          </button>
          <button className='px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded'>
            90 Days
          </button>
        </div>
      </div>

      <div className='h-80'>
        <ResponsiveContainer
          width='100%'
          height='100%'>
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid
              strokeDasharray='3 3'
              stroke='#f0f0f0'
            />
            <XAxis
              dataKey='date'
              stroke='#6b7280'
              fontSize={12}
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }
            />
            <YAxis
              stroke='#6b7280'
              fontSize={12}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <Tooltip
              labelFormatter={(value) =>
                new Date(value).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              }
              formatter={(value: number) => [
                `$${value.toLocaleString()}`,
                "Sales",
              ]}
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "6px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
            />
            <Legend />
            <Line
              type='monotone'
              dataKey='sales'
              stroke='#3b82f6'
              strokeWidth={2}
              dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: "#1d4ed8" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className='mt-4 flex items-center justify-between text-sm text-gray-600'>
        <div className='flex items-center'>
          <div className='w-3 h-3 bg-blue-500 rounded-full mr-2'></div>
          <span>Daily Sales Revenue</span>
        </div>
        <span>Last updated: {new Date().toLocaleTimeString()}</span>
      </div>
    </div>
  );
};

export default SalesChart;
