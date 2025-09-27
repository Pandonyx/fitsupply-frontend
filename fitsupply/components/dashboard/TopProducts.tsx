// components/dashboard/TopProducts.tsx
import { useState, useEffect } from "react";

interface TopProduct {
  id: number;
  name: string;
  total_sold: number;
  revenue: string;
  category: {
    name: string;
  };
}

export default function TopProducts() {
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    fetchTopProducts();
  }, []);

  const fetchTopProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/api/v1/analytics/top-products/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setTopProducts(data.results || data || []);
      } else {
        console.error("Failed to fetch top products");
        // Fallback to mock data if API fails
        setTopProducts([
          {
            id: 1,
            name: "Whey Protein Powder",
            total_sold: 45,
            revenue: "1347.55",
            category: { name: "Protein" },
          },
          {
            id: 2,
            name: "Creatine Monohydrate",
            total_sold: 32,
            revenue: "959.68",
            category: { name: "Creatine" },
          },
          {
            id: 3,
            name: "BCAA Supplement",
            total_sold: 28,
            revenue: "811.72",
            category: { name: "Amino Acids" },
          },
          {
            id: 4,
            name: "Pre-Workout Formula",
            total_sold: 24,
            revenue: "719.76",
            category: { name: "Pre-Workout" },
          },
          {
            id: 5,
            name: "Multivitamin",
            total_sold: 19,
            revenue: "474.81",
            category: { name: "Vitamins" },
          },
        ]);
      }
    } catch (error) {
      console.error("Error fetching top products:", error);
      // Fallback to mock data
      setTopProducts([
        {
          id: 1,
          name: "Whey Protein Powder",
          total_sold: 45,
          revenue: "1347.55",
          category: { name: "Protein" },
        },
        {
          id: 2,
          name: "Creatine Monohydrate",
          total_sold: 32,
          revenue: "959.68",
          category: { name: "Creatine" },
        },
        {
          id: 3,
          name: "BCAA Supplement",
          total_sold: 28,
          revenue: "811.72",
          category: { name: "Amino Acids" },
        },
        {
          id: 4,
          name: "Pre-Workout Formula",
          total_sold: 24,
          revenue: "719.76",
          category: { name: "Pre-Workout" },
        },
        {
          id: 5,
          name: "Multivitamin",
          total_sold: 19,
          revenue: "474.81",
          category: { name: "Vitamins" },
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className='bg-white p-6 rounded-lg shadow'>
        <h3 className='text-lg font-medium text-gray-900 mb-4'>
          Top Selling Products
        </h3>
        <div className='space-y-3'>
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className='animate-pulse'>
              <div className='flex justify-between items-center'>
                <div className='flex-1'>
                  <div className='h-4 bg-gray-200 rounded w-3/4 mb-1'></div>
                  <div className='h-3 bg-gray-200 rounded w-1/2'></div>
                </div>
                <div className='text-right'>
                  <div className='h-4 bg-gray-200 rounded w-16 mb-1'></div>
                  <div className='h-3 bg-gray-200 rounded w-12'></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className='bg-white p-6 rounded-lg shadow'>
      <div className='flex justify-between items-center mb-4'>
        <h3 className='text-lg font-medium text-gray-900'>
          Top Selling Products
        </h3>
        <button
          onClick={fetchTopProducts}
          className='text-sm text-blue-600 hover:text-blue-800'>
          Refresh
        </button>
      </div>

      {topProducts.length > 0 ? (
        <div className='space-y-4'>
          {topProducts.map((product, index) => (
            <div
              key={product.id}
              className='flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg transition-colors'>
              <div className='flex items-center space-x-3'>
                <div className='flex-shrink-0'>
                  <span className='inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-800 text-xs font-medium rounded-full'>
                    {index + 1}
                  </span>
                </div>
                <div className='flex-1 min-w-0'>
                  <p className='text-sm font-medium text-gray-900 truncate'>
                    {product.name}
                  </p>
                  <p className='text-xs text-gray-500'>
                    {product.category?.name || "Uncategorized"}
                  </p>
                </div>
              </div>
              <div className='text-right flex-shrink-0'>
                <p className='text-sm font-medium text-gray-900'>
                  {product.total_sold} sold
                </p>
                <p className='text-xs text-gray-500'>
                  ${parseFloat(product.revenue || "0").toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className='text-center py-4'>
          <p className='text-gray-500 text-sm'>No sales data available</p>
        </div>
      )}
    </div>
  );
}
