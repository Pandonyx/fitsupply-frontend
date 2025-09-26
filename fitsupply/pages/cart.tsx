import { useSelector, useDispatch } from "react-redux";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { RootState, AppDispatch } from "@/store";
import {
  removeFromCart,
  updateQty,
  fetchCart,
  saveCart,
} from "@/store/slices/cartSlice";
import { FaTrash } from "react-icons/fa";

export default function CartPage() {
  const { items } = useSelector((s: RootState) => s.cart);
  const { user } = useSelector((s: RootState) => s.auth);
  const dispatch = useDispatch<AppDispatch>();
  const isInitialMount = useRef(true);

  // Fetch cart on mount
  useEffect(() => {
    if (user) dispatch(fetchCart());
  }, [dispatch, user]);

  // Save cart on unmount (when user navigates away)
  useEffect(() => {
    // This function will be called when the component unmounts
    return () => {
      // Only save the cart if the user is logged in and the cart is not empty
      if (user && items.length > 0) dispatch(saveCart());
    };
  }, [dispatch, user, items]); // Re-run effect if user or items change

  const subtotal = items.reduce((sum, i) => sum + i.qty * +i.price, 0);

  if (items.length === 0) {
    return (
      <main className='container mx-auto p-4 text-center'>
        <h1 className='text-3xl font-bold mb-4'>My Cart</h1>
        <p className='text-gray-600 mb-6'>Your cart is currently empty.</p>
        <Link
          href='/products'
          className='bg-black text-white px-6 py-3 rounded-md font-semibold hover:bg-gray-800 transition-colors'>
          Continue Shopping
        </Link>
      </main>
    );
  }

  return (
    <main className='container mx-auto p-4'>
      <h1 className='text-3xl font-bold mb-6'>My Cart</h1>
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        <div className='lg:col-span-2'>
          <div className='space-y-4'>
            {items.map((item) => (
              <div
                key={item.productId}
                className='flex items-center justify-between border p-4 rounded-lg shadow-sm bg-white'>
                <div className='flex items-center gap-4'>
                  <div className='relative w-20 h-20 bg-gray-100 rounded'>
                    <Image
                      src={item.image || "/images/placeholder.png"}
                      alt={item.name}
                      fill
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                  <div>
                    <div className='font-semibold'>{item.name}</div>
                    <div className='text-sm text-gray-600'>
                      ${(+item.price).toFixed(2)}
                    </div>
                  </div>
                </div>
                <div className='flex items-center gap-4'>
                  <input
                    type='number'
                    value={item.qty}
                    min={1}
                    onChange={(e) =>
                      dispatch(
                        updateQty({
                          id: item.productId,
                          qty: Number(e.target.value),
                        })
                      )
                    }
                    className='w-16 border rounded p-1 text-center'
                  />
                  <button
                    className='text-red-500 hover:text-red-700'
                    onClick={() => dispatch(removeFromCart(item.productId))}>
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className='bg-gray-50 p-6 rounded-lg shadow-sm h-fit'>
          <h2 className='text-xl font-bold mb-4'>Order Summary</h2>
          <div className='flex justify-between mb-2'>
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className='flex justify-between mb-4'>
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div className='flex justify-between font-bold text-lg border-t pt-4'>
            <span>Total</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <Link
            href='/checkout'
            className='mt-6 w-full bg-black text-white text-center px-4 py-3 rounded-md block font-semibold hover:bg-gray-800'>
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </main>
  );
}
