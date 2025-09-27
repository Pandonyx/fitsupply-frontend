import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import {
  fetchCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "@/store/slices/cartSlice";
import type { RootState, AppDispatch } from "@/store";

export default function CartPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { items, total, status, error } = useSelector(
    (state: RootState) => state.cart
  );
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  // Only fetch cart once when component mounts and user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
    }
  }, [dispatch, isAuthenticated]);

  const handleUpdateQuantity = (itemId: number, quantity: number) => {
    if (quantity <= 0) {
      dispatch(removeFromCart(itemId));
    } else {
      dispatch(updateCartItem({ itemId, quantity }));
    }
  };

  const handleRemoveItem = (itemId: number) => {
    dispatch(removeFromCart(itemId));
  };

  const handleClearCart = () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      dispatch(clearCart());
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      router.push("/auth/login?redirect=/checkout");
      return;
    }

    if (items.length === 0) {
      alert("Your cart is empty");
      return;
    }

    // Navigate to checkout page
    router.push("/checkout");
  };

  // Show loading state
  if (status === "loading") {
    return (
      <div className='min-h-screen bg-gray-50'>
        <div className='container mx-auto px-6 py-8'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
            <p className='mt-4 text-gray-600'>Loading your cart...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='container mx-auto px-6 py-8'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900'>Shopping Cart</h1>
          <p className='text-gray-600 mt-2'>
            {items.length === 0
              ? "Your cart is empty"
              : `${items.length} item${
                  items.length !== 1 ? "s" : ""
                } in your cart`}
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6'>
            <p>{error}</p>
          </div>
        )}

        {/* Empty cart */}
        {items.length === 0 ? (
          <div className='bg-white rounded-lg shadow-sm p-8 text-center'>
            <div className='mb-6'>
              <svg
                className='w-24 h-24 mx-auto text-gray-300'
                fill='currentColor'
                viewBox='0 0 24 24'>
                <path d='M7 4V2C7 1.45 6.55 1 6 1S5 1.45 5 2V4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4H19V2C19 1.45 18.55 1 18 1S17 1.45 17 2V4H7Z' />
              </svg>
            </div>
            <h3 className='text-xl font-semibold text-gray-900 mb-2'>
              Your cart is empty
            </h3>
            <p className='text-gray-600 mb-6'>
              Start shopping to add items to your cart
            </p>
            <Link
              href='/products'
              className='inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium'>
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className='lg:grid lg:grid-cols-12 lg:gap-8'>
            {/* Cart Items */}
            <div className='lg:col-span-8'>
              <div className='bg-white rounded-lg shadow-sm overflow-hidden'>
                <div className='px-6 py-4 border-b border-gray-200'>
                  <h2 className='text-lg font-semibold'>Cart Items</h2>
                </div>

                <div className='divide-y divide-gray-200'>
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className='p-6'>
                      <div className='flex items-start space-x-4'>
                        {/* Product Image */}
                        <div className='flex-shrink-0 w-20 h-20 bg-gray-200 rounded-lg overflow-hidden'>
                          {item.product.image ? (
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className='w-full h-full object-cover'
                            />
                          ) : (
                            <div className='w-full h-full bg-gray-200 flex items-center justify-center'>
                              <svg
                                className='w-8 h-8 text-gray-400'
                                fill='currentColor'
                                viewBox='0 0 24 24'>
                                <path d='M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z' />
                              </svg>
                            </div>
                          )}
                        </div>

                        {/* Product Details */}
                        <div className='flex-1 min-w-0'>
                          <div className='flex items-start justify-between'>
                            <div>
                              <h3 className='text-lg font-medium text-gray-900'>
                                <Link
                                  href={`/products/${item.product.slug}`}
                                  className='hover:text-blue-600'>
                                  {item.product.name}
                                </Link>
                              </h3>
                              <p className='text-gray-600 mt-1'>
                                ${item.product.price} each
                              </p>
                            </div>

                            {/* Remove Button */}
                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              className='text-red-500 hover:text-red-700 p-1'
                              title='Remove item'>
                              <svg
                                className='w-5 h-5'
                                fill='currentColor'
                                viewBox='0 0 24 24'>
                                <path d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z' />
                              </svg>
                            </button>
                          </div>

                          {/* Quantity Controls */}
                          <div className='flex items-center justify-between mt-4'>
                            <div className='flex items-center border border-gray-300 rounded-lg'>
                              <button
                                onClick={() =>
                                  handleUpdateQuantity(
                                    item.id,
                                    item.quantity - 1
                                  )
                                }
                                className='px-3 py-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-l-lg'
                                disabled={status === "loading"}>
                                −
                              </button>
                              <span className='px-4 py-1 text-gray-900 border-l border-r border-gray-300'>
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  handleUpdateQuantity(
                                    item.id,
                                    item.quantity + 1
                                  )
                                }
                                className='px-3 py-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-r-lg'
                                disabled={status === "loading"}>
                                +
                              </button>
                            </div>

                            {/* Item Total */}
                            <div className='text-lg font-semibold text-gray-900'>
                              ${item.total_price}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Clear Cart */}
                <div className='px-6 py-4 bg-gray-50 border-t border-gray-200'>
                  <button
                    onClick={handleClearCart}
                    className='text-red-600 hover:text-red-800 text-sm font-medium'
                    disabled={status === "loading"}>
                    Clear Cart
                  </button>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className='lg:col-span-4 mt-8 lg:mt-0'>
              <div className='bg-white rounded-lg shadow-sm p-6 sticky top-4'>
                <h2 className='text-lg font-semibold mb-4'>Order Summary</h2>

                <div className='space-y-3 mb-6'>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Subtotal</span>
                    <span className='font-medium'>${total}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Shipping</span>
                    <span className='font-medium'>Free</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Tax</span>
                    <span className='font-medium'>Calculated at checkout</span>
                  </div>
                  <div className='border-t border-gray-200 pt-3'>
                    <div className='flex justify-between'>
                      <span className='text-lg font-semibold'>Total</span>
                      <span className='text-lg font-semibold'>${total}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className='w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium mb-4 disabled:bg-gray-400 disabled:cursor-not-allowed'
                  disabled={status === "loading" || items.length === 0}>
                  {status === "loading"
                    ? "Processing..."
                    : "Proceed to Checkout"}
                </button>

                <Link
                  href='/products'
                  className='block w-full text-center border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors'>
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
