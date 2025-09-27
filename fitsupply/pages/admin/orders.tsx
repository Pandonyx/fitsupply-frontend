import { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

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
  user: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
  } | null;
  status: string;
  total_amount: string;
  shipping_address: string;
  billing_address: string;
  payment_method: string;
  notes: string;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
}

const ORDER_STATUS_OPTIONS = [
  {
    value: "pending",
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    value: "confirmed",
    label: "Confirmed",
    color: "bg-blue-100 text-blue-800",
  },
  {
    value: "processing",
    label: "Processing",
    color: "bg-purple-100 text-purple-800",
  },
  {
    value: "shipped",
    label: "Shipped",
    color: "bg-indigo-100 text-indigo-800",
  },
  {
    value: "delivering",
    label: "Delivering",
    color: "bg-orange-100 text-orange-800",
  },
  {
    value: "delivered",
    label: "Delivered",
    color: "bg-green-100 text-green-800",
  },
  { value: "cancelled", label: "Cancelled", color: "bg-red-100 text-red-800" },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/v1/orders/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data.results || data);
      } else {
        console.error("Failed to fetch orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/orders/${orderId}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (response.ok) {
        const updatedOrder = await response.json();
        setOrders(
          orders.map((order) => (order.id === orderId ? updatedOrder : order))
        );
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(updatedOrder);
        }
      } else {
        alert("Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Error updating order status");
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user?.first_name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        order.user?.last_name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        order.user?.username?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  const getStatusInfo = (status: string) => {
    return (
      ORDER_STATUS_OPTIONS.find((option) => option.value === status) || {
        value: status,
        label: status,
        color: "bg-gray-100 text-gray-800",
      }
    );
  };

  const openOrderModal = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
    setActiveTab("details");
  };

  const closeOrderModal = () => {
    setSelectedOrder(null);
    setIsModalOpen(false);
  };

  return (
    <div className='min-h-screen bg-gray-50 p-6'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>
            Orders Management
          </h1>
          <p className='text-gray-600'>
            Manage customer orders and track their status
          </p>
        </div>

        {/* Filters */}
        <div className='bg-white rounded-lg shadow-sm p-6 mb-6'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Search Orders
              </label>
              <input
                type='text'
                placeholder='Search by order #, email, or customer name...'
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Filter by Status
              </label>
              <select
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}>
                <option value='all'>All Status</option>
                {ORDER_STATUS_OPTIONS.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className='flex items-end'>
              <button
                onClick={fetchOrders}
                className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors'>
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-6'>
          <div className='bg-white rounded-lg shadow-sm p-6'>
            <h3 className='text-sm font-medium text-gray-500'>Total Orders</h3>
            <p className='text-2xl font-bold text-gray-900'>{orders.length}</p>
          </div>
          <div className='bg-white rounded-lg shadow-sm p-6'>
            <h3 className='text-sm font-medium text-gray-500'>
              Pending Orders
            </h3>
            <p className='text-2xl font-bold text-yellow-600'>
              {orders.filter((o) => o.status === "pending").length}
            </p>
          </div>
          <div className='bg-white rounded-lg shadow-sm p-6'>
            <h3 className='text-sm font-medium text-gray-500'>Processing</h3>
            <p className='text-2xl font-bold text-blue-600'>
              {
                orders.filter((o) =>
                  ["confirmed", "processing", "shipped"].includes(o.status)
                ).length
              }
            </p>
          </div>
          <div className='bg-white rounded-lg shadow-sm p-6'>
            <h3 className='text-sm font-medium text-gray-500'>Completed</h3>
            <p className='text-2xl font-bold text-green-600'>
              {orders.filter((o) => o.status === "delivered").length}
            </p>
          </div>
        </div>

        {/* Orders Table */}
        <div className='bg-white rounded-lg shadow-sm overflow-hidden'>
          <div className='px-6 py-4 border-b border-gray-200'>
            <h2 className='text-lg font-semibold text-gray-900'>
              Orders ({filteredOrders.length})
            </h2>
          </div>

          {loading ? (
            <div className='p-8 text-center'>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto'></div>
              <p className='mt-2 text-gray-600'>Loading orders...</p>
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Order Details
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Customer
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Status
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Total
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Date
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {filteredOrders.map((order) => {
                    const statusInfo = getStatusInfo(order.status);
                    return (
                      <tr
                        key={order.id}
                        className='hover:bg-gray-50'>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <div>
                            <div className='text-sm font-medium text-gray-900'>
                              #{order.order_number.slice(0, 8)}
                            </div>
                            <div className='text-sm text-gray-500'>
                              {order.items.length} item(s)
                            </div>
                          </div>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <div>
                            <div className='text-sm font-medium text-gray-900'>
                              {order.user
                                ? `${order.user.first_name} ${order.user.last_name}`
                                : "Guest"}
                            </div>
                            <div className='text-sm text-gray-500'>
                              {order.user?.email || "No email"}
                            </div>
                          </div>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusInfo.color}`}>
                            {statusInfo.label}
                          </span>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                          ${parseFloat(order.total_amount).toFixed(2)}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                          {new Date(order.created_at).toLocaleDateString()}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                          <button
                            onClick={() => openOrderModal(order)}
                            className='text-blue-600 hover:text-blue-900 mr-4'>
                            View Details
                          </button>
                          <select
                            value={order.status}
                            onChange={(e) =>
                              updateOrderStatus(order.id, e.target.value)
                            }
                            className='text-sm border border-gray-300 rounded px-2 py-1'>
                            {ORDER_STATUS_OPTIONS.map((option) => (
                              <option
                                key={option.value}
                                value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {filteredOrders.length === 0 && (
                <div className='p-8 text-center text-gray-500'>
                  No orders found matching your criteria.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {isModalOpen && selectedOrder && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto'>
            {/* Modal Header */}
            <div className='px-6 py-4 border-b border-gray-200 flex justify-between items-center'>
              <h2 className='text-xl font-semibold text-gray-900'>
                Order #{selectedOrder.order_number.slice(0, 8)}
              </h2>
              <button
                onClick={closeOrderModal}
                className='text-gray-400 hover:text-gray-600'>
                <svg
                  className='w-6 h-6'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </button>
            </div>

            {/* Tabs */}
            <div className='border-b border-gray-200'>
              <nav className='flex space-x-8 px-6'>
                {[
                  { id: "details", label: "Order Details" },
                  { id: "items", label: "Items" },
                  { id: "customer", label: "Customer Info" },
                  { id: "shipping", label: "Shipping & Billing" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}>
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className='p-6'>
              {activeTab === "details" && (
                <div className='space-y-4'>
                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700'>
                        Order Number
                      </label>
                      <p className='mt-1 text-sm text-gray-900'>
                        {selectedOrder.order_number}
                      </p>
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700'>
                        Status
                      </label>
                      <span
                        className={`mt-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          getStatusInfo(selectedOrder.status).color
                        }`}>
                        {getStatusInfo(selectedOrder.status).label}
                      </span>
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700'>
                        Total Amount
                      </label>
                      <p className='mt-1 text-sm text-gray-900 font-semibold'>
                        ${parseFloat(selectedOrder.total_amount).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700'>
                        Payment Method
                      </label>
                      <p className='mt-1 text-sm text-gray-900'>
                        {selectedOrder.payment_method}
                      </p>
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700'>
                        Created
                      </label>
                      <p className='mt-1 text-sm text-gray-900'>
                        {new Date(selectedOrder.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700'>
                        Last Updated
                      </label>
                      <p className='mt-1 text-sm text-gray-900'>
                        {new Date(selectedOrder.updated_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {selectedOrder.notes && (
                    <div>
                      <label className='block text-sm font-medium text-gray-700'>
                        Notes
                      </label>
                      <p className='mt-1 text-sm text-gray-900'>
                        {selectedOrder.notes}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "items" && (
                <div>
                  <h3 className='text-lg font-medium text-gray-900 mb-4'>
                    Order Items
                  </h3>
                  <div className='space-y-4'>
                    {selectedOrder.items.map((item) => (
                      <div
                        key={item.id}
                        className='flex items-center space-x-4 p-4 border border-gray-200 rounded-lg'>
                        <img
                          src={item.product.image || "/placeholder.png"}
                          alt={item.product.name}
                          className='w-16 h-16 object-cover rounded'
                        />
                        <div className='flex-1'>
                          <h4 className='font-medium text-gray-900'>
                            {item.product.name}
                          </h4>
                          <p className='text-sm text-gray-600'>
                            Quantity: {item.quantity}
                          </p>
                          <p className='text-sm text-gray-600'>
                            Price: ${parseFloat(item.price_at_time).toFixed(2)}
                          </p>
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
              )}

              {activeTab === "customer" && (
                <div>
                  <h3 className='text-lg font-medium text-gray-900 mb-4'>
                    Customer Information
                  </h3>
                  {selectedOrder.user ? (
                    <div className='space-y-4'>
                      <div className='grid grid-cols-2 gap-4'>
                        <div>
                          <label className='block text-sm font-medium text-gray-700'>
                            First Name
                          </label>
                          <p className='mt-1 text-sm text-gray-900'>
                            {selectedOrder.user.first_name}
                          </p>
                        </div>
                        <div>
                          <label className='block text-sm font-medium text-gray-700'>
                            Last Name
                          </label>
                          <p className='mt-1 text-sm text-gray-900'>
                            {selectedOrder.user.last_name}
                          </p>
                        </div>
                        <div>
                          <label className='block text-sm font-medium text-gray-700'>
                            Username
                          </label>
                          <p className='mt-1 text-sm text-gray-900'>
                            {selectedOrder.user.username}
                          </p>
                        </div>
                        <div>
                          <label className='block text-sm font-medium text-gray-700'>
                            Email
                          </label>
                          <p className='mt-1 text-sm text-gray-900'>
                            {selectedOrder.user.email}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className='text-gray-500'>
                      Guest customer - no account information available.
                    </p>
                  )}
                </div>
              )}

              {activeTab === "shipping" && (
                <div>
                  <h3 className='text-lg font-medium text-gray-900 mb-4'>
                    Shipping & Billing
                  </h3>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Shipping Address
                      </label>
                      <div className='p-3 bg-gray-50 rounded-lg'>
                        <p className='text-sm text-gray-900 whitespace-pre-line'>
                          {selectedOrder.shipping_address}
                        </p>
                      </div>
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Billing Address
                      </label>
                      <div className='p-3 bg-gray-50 rounded-lg'>
                        <p className='text-sm text-gray-900 whitespace-pre-line'>
                          {selectedOrder.billing_address}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className='px-6 py-4 border-t border-gray-200 flex justify-end space-x-3'>
              <button
                onClick={closeOrderModal}
                className='px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors'>
                Close
              </button>
              <select
                value={selectedOrder.status}
                onChange={(e) =>
                  updateOrderStatus(selectedOrder.id, e.target.value)
                }
                className='px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500'>
                {ORDER_STATUS_OPTIONS.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
