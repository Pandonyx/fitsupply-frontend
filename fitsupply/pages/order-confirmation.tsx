// pages/order-confirmation.tsx
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";

interface OrderItem {
  id: number;
  product: {
    id: number;
    name: string;
    image: string;
  };
  quantity: number;
  price_at_time: string;
  subtotal: string;
}

interface Order {
  id: number;
  order_number: string;
  status: string;
  total_amount: string;
  shipping_address: string;
  billing_address: string;
  payment_method: string;
  created_at: string;
  items: OrderItem[];
}

export default function OrderConfirmationPage() {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    // Get the most recent order for this user
    fetchLatestOrder();
  }, []);

  const fetchLatestOrder = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/orders/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const orders = data.results || data;
        if (orders.length > 0) {
          // Get the most recent order
          setOrder(orders[0]);
        } else {
          setError("No order found");
        }
      } else {
        setError("Failed to fetch order details");
      }
    } catch (error) {
      console.error("Error fetching order:", error);
      setError("Failed to load order information");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-purple-100 text-purple-800";
      case "shipped":
        return "bg-indigo-100 text-indigo-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  if (loading) {
    return (
      <main className='min-h-screen bg-gray-50 py-8'>
        <div className='container mx-auto px-4 text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
          <p className='mt-4 text-gray-600'>Loading your order details...</p>
        </div>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className='min-h-screen bg-gray-50 py-8'>
        <div className='container mx-auto px-4 text-center'>
          <div className='bg-white p-8 rounded-lg shadow-sm max-w-md mx-auto'>
            <div className='text-red-500 mb-4'>
              <svg
                className='w-16 h-16 mx-auto'
                fill='currentColor'
                viewBox='0 0 20 20'>
                <path
                  fillRule='evenodd'
                  d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                  clipRule='evenodd'
                />
              </svg>
            </div>
            <h1 className='text-xl font-semibold text-gray-900 mb-2'>
              Order Not Found
            </h1>
            <p className='text-gray-600 mb-6'>{error}</p>
            <Link
              href='/products'
              className='bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors'>
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className='min-h-screen bg-gray-50 py-8'>
      <div className='container mx-auto px-4'>
        {/* Success Header */}
        <div className='text-center mb-8'>
          <div className='inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4'>
            <svg
              className='w-8 h-8 text-green-600'
              fill='currentColor'
              viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                clipRule='evenodd'
              />
            </svg>
          </div>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>
            Order Confirmed!
          </h1>
          <p className='text-lg text-gray-600'>
            Thank you for your purchase. We'll send you shipping updates via
            email.
          </p>
        </div>

        <div className='max-w-4xl mx-auto'>
          {/* Order Summary Card */}
          <div className='bg-white rounded-lg shadow-sm p-6 mb-6'>
            <div className='border-b border-gray-200 pb-4 mb-6'>
              <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between'>
                <div>
                  <h2 className='text-xl font-semibold text-gray-900'>
                    Order #{order.order_number.slice(0, 8)}
                  </h2>
                  <p className='text-sm text-gray-600'>
                    Placed on{" "}
                    {new Date(order.created_at).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div className='mt-2 sm:mt-0'>
                  <span
                    className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(
                      order.status
                    )}`}>
                    {formatStatus(order.status)}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className='mb-6'>
              <h3 className='text-lg font-medium text-gray-900 mb-4'>
                Items Ordered
              </h3>
              <div className='space-y-4'>
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className='flex items-center space-x-4 p-4 bg-gray-50 rounded-lg'>
                    <div className='relative w-16 h-16 bg-white rounded-md overflow-hidden'>
                      <Image
                        src={item.product.image || "/placeholder.png"}
                        alt={item.product.name}
                        fill
                        style={{ objectFit: "contain" }}
                        className='p-2'
                      />
                    </div>
                    <div className='flex-1'>
                      <h4 className='font-medium text-gray-900'>
                        {item.product.name}
                      </h4>
                      <div className='flex items-center justify-between mt-1'>
                        <p className='text-sm text-gray-600'>
                          Quantity: {item.quantity}
                        </p>
                        <p className='text-sm text-gray-600'>
                          ${parseFloat(item.price_at_time).toFixed(2)} each
                        </p>
                      </div>
                    </div>
                    <div className='text-right'>
                      <p className='font-medium text-gray-900'>
                        ${parseFloat(item.subtotal).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Total */}
            <div className='border-t border-gray-200 pt-4'>
              <div className='flex justify-between items-center'>
                <span className='text-lg font-semibold text-gray-900'>
                  Total Paid
                </span>
                <span className='text-2xl font-bold text-gray-900'>
                  ${parseFloat(order.total_amount).toFixed(2)}
                </span>
              </div>
              <p className='text-sm text-gray-600 mt-1'>
                Payment method:{" "}
                {order.payment_method === "credit_card"
                  ? "Credit Card"
                  : order.payment_method}
              </p>
            </div>
          </div>

          {/* Shipping Information */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
            <div className='bg-white rounded-lg shadow-sm p-6'>
              <h3 className='text-lg font-medium text-gray-900 mb-3'>
                Shipping Address
              </h3>
              <div className='text-gray-600 whitespace-pre-line'>
                {order.shipping_address}
              </div>
            </div>

            <div className='bg-white rounded-lg shadow-sm p-6'>
              <h3 className='text-lg font-medium text-gray-900 mb-3'>
                Estimated Delivery
              </h3>
              <div className='text-gray-600'>
                <p className='font-medium'>Standard Shipping (Free)</p>
                <p className='text-sm'>
                  {new Date(
                    Date.now() + 5 * 24 * 60 * 60 * 1000
                  ).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}{" "}
                  -{" "}
                  {new Date(
                    Date.now() + 7 * 24 * 60 * 60 * 1000
                  ).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className='text-xs text-gray-500 mt-1'>
                  We'll send you tracking information when your order ships.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Link
              href='/products'
              className='bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition-colors font-semibold text-center'>
              Continue Shopping
            </Link>
            <Link
              href='/account/orders'
              className='bg-gray-200 text-gray-700 px-8 py-3 rounded-md hover:bg-gray-300 transition-colors font-semibold text-center'>
              View All Orders
            </Link>
          </div>

          {/* Help Section */}
          <div className='bg-blue-50 rounded-lg p-6 mt-8 text-center'>
            <h3 className='text-lg font-medium text-blue-900 mb-2'>
              Need Help?
            </h3>
            <p className='text-blue-700 mb-4'>
              Questions about your order? We're here to help!
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <a
                href='mailto:support@fitsupply.com'
                className='text-blue-600 hover:text-blue-800 font-medium'>
                Email Support
              </a>
              <span className='hidden sm:inline text-blue-300'>|</span>
              <a
                href='tel:+1234567890'
                className='text-blue-600 hover:text-blue-800 font-medium'>
                Call (123) 456-7890
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
