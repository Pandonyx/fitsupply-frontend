// components/dashboard/RecentActivity.tsx
import { useState, useEffect } from "react";

interface ActivityItem {
  id: number;
  action: string;
  description: string;
  timestamp: string;
  type: "order" | "product" | "customer" | "payment" | "review";
  user?: {
    username: string;
    first_name: string;
    last_name: string;
  };
}

export default function RecentActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    fetchRecentActivity();
  }, []);

  const fetchRecentActivity = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/api/v1/analytics/recent-activity/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setActivities(data.results || data || []);
      } else {
        console.error("Failed to fetch recent activity");
        // Fallback to mock data
        generateMockActivity();
      }
    } catch (error) {
      console.error("Error fetching recent activity:", error);
      // Fallback to mock data
      generateMockActivity();
    } finally {
      setLoading(false);
    }
  };

  const generateMockActivity = () => {
    const now = new Date();
    const mockActivities: ActivityItem[] = [
      {
        id: 1,
        action: "New Order Placed",
        description: "Order #abc12345 - $89.99",
        timestamp: new Date(now.getTime() - 2 * 60 * 1000).toISOString(),
        type: "order",
        user: { username: "john_doe", first_name: "John", last_name: "Doe" },
      },
      {
        id: 2,
        action: "Product Stock Updated",
        description: "Whey Protein Powder stock increased to 150",
        timestamp: new Date(now.getTime() - 15 * 60 * 1000).toISOString(),
        type: "product",
      },
      {
        id: 3,
        action: "Customer Registered",
        description: "New customer: jane.smith@email.com",
        timestamp: new Date(now.getTime() - 60 * 60 * 1000).toISOString(),
        type: "customer",
        user: {
          username: "jane_smith",
          first_name: "Jane",
          last_name: "Smith",
        },
      },
      {
        id: 4,
        action: "Payment Processed",
        description: "Payment for Order #def67890 - $124.50",
        timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
        type: "payment",
      },
      {
        id: 5,
        action: "Product Review",
        description: "5-star review for Creatine Monohydrate",
        timestamp: new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString(),
        type: "review",
        user: {
          username: "mike_wilson",
          first_name: "Mike",
          last_name: "Wilson",
        },
      },
      {
        id: 6,
        action: "Order Status Updated",
        description: "Order #ghi34567 marked as shipped",
        timestamp: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString(),
        type: "order",
      },
    ];
    setActivities(mockActivities);
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInMinutes = Math.floor(
      (now.getTime() - activityTime.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60)
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24)
      return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`;
  };

  const getActivityIcon = (type: string) => {
    const baseClasses = "flex-shrink-0 w-2 h-2 rounded-full mt-2";
    switch (type) {
      case "order":
        return `${baseClasses} bg-green-400`;
      case "product":
        return `${baseClasses} bg-blue-400`;
      case "customer":
        return `${baseClasses} bg-purple-400`;
      case "payment":
        return `${baseClasses} bg-yellow-400`;
      case "review":
        return `${baseClasses} bg-pink-400`;
      default:
        return `${baseClasses} bg-gray-400`;
    }
  };

  if (loading) {
    return (
      <div className='bg-white p-6 rounded-lg shadow'>
        <h3 className='text-lg font-medium text-gray-900 mb-4'>
          Recent Activity
        </h3>
        <div className='space-y-3'>
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className='animate-pulse'>
              <div className='flex items-start space-x-3'>
                <div className='w-2 h-2 bg-gray-200 rounded-full mt-2'></div>
                <div className='flex-1 min-w-0'>
                  <div className='h-4 bg-gray-200 rounded w-3/4 mb-1'></div>
                  <div className='h-3 bg-gray-200 rounded w-1/2'></div>
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
        <h3 className='text-lg font-medium text-gray-900'>Recent Activity</h3>
        <button
          onClick={fetchRecentActivity}
          className='text-sm text-blue-600 hover:text-blue-800'>
          Refresh
        </button>
      </div>

      {activities.length > 0 ? (
        <div className='space-y-4'>
          {activities.map((activity) => (
            <div
              key={activity.id}
              className='flex items-start space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors'>
              <div className={getActivityIcon(activity.type)}></div>
              <div className='flex-1 min-w-0'>
                <div className='flex items-center justify-between'>
                  <p className='text-sm font-medium text-gray-900 truncate'>
                    {activity.action}
                  </p>
                  <p className='text-xs text-gray-500 flex-shrink-0 ml-2'>
                    {getTimeAgo(activity.timestamp)}
                  </p>
                </div>
                <p className='text-xs text-gray-600 mt-1'>
                  {activity.description}
                </p>
                {activity.user && (
                  <p className='text-xs text-gray-500 mt-1'>
                    by {activity.user.first_name} {activity.user.last_name}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className='text-center py-4'>
          <p className='text-gray-500 text-sm'>No recent activity</p>
        </div>
      )}

      <div className='mt-4 pt-4 border-t border-gray-200'>
        <button className='w-full text-sm text-blue-600 hover:text-blue-800 font-medium'>
          View All Activity
        </button>
      </div>
    </div>
  );
}
