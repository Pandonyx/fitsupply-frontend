import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import Image from "next/image";
import { RootState } from "@/store";

export default function CheckoutPage() {
  const { items } = useSelector((s: RootState) => s.cart);
  const router = useRouter();
  const subtotal = items.reduce((sum, i) => sum + i.qty * i.price, 0);

  const [formData, setFormData] = useState({
    email: "",
    name: "",
    address: "",
    city: "",
    postalCode: "",
    country: "United States",
  });

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      router.push("/cart");
    }
  }, [items, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // In a real app, you would process the payment here
    console.log("Order submitted:", {
      formData,
      items,
      total: subtotal,
    });
    alert("Order placed successfully! (Check console for details)");
    // Here you would typically clear the cart and redirect to a success page
    // dispatch(clearCart());
    // router.push('/order-success');
  };

  if (items.length === 0) {
    return <div className='p-6'>Loading or redirecting...</div>;
  }

  return (
    <main className='container mx-auto p-4'>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
        {/* Left Side: Form */}
        <div>
          <h1 className='text-3xl font-bold mb-6'>Shipping & Payment</h1>
          <form
            onSubmit={handleSubmit}
            className='space-y-6'>
            {/* Shipping Information */}
            <div className='space-y-4'>
              <h2 className='text-xl font-semibold'>Shipping Information</h2>
              <div>
                <label
                  htmlFor='email'
                  className='block text-sm font-medium text-gray-700'>
                  Email Address
                </label>
                <input
                  type='email'
                  name='email'
                  id='email'
                  required
                  onChange={handleChange}
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2'
                />
              </div>
              <div>
                <label
                  htmlFor='name'
                  className='block text-sm font-medium text-gray-700'>
                  Full Name
                </label>
                <input
                  type='text'
                  name='name'
                  id='name'
                  required
                  onChange={handleChange}
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2'
                />
              </div>
              {/* Add more address fields as needed */}
            </div>

            {/* Payment Details (UI Only) */}
            <div className='space-y-4'>
              <h2 className='text-xl font-semibold'>Payment Details</h2>
              <p className='text-sm text-gray-500'>
                This is a demo. Please do not enter real card details.
              </p>
              <div>
                <label
                  htmlFor='card-number'
                  className='block text-sm font-medium text-gray-700'>
                  Card Number
                </label>
                <input
                  type='text'
                  id='card-number'
                  placeholder='xxxx xxxx xxxx xxxx'
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2'
                />
              </div>
            </div>

            <button
              type='submit'
              className='w-full bg-black text-white px-6 py-3 rounded-md font-semibold hover:bg-gray-800 transition-colors'>
              Place Order
            </button>
          </form>
        </div>

        {/* Right Side: Order Summary */}
        <div className='bg-gray-50 p-6 rounded-lg shadow-sm h-fit'>
          <h2 className='text-xl font-bold mb-4'>Order Summary</h2>
          <div className='space-y-4 mb-4'>
            {items.map((item) => (
              <div
                key={item.productId}
                className='flex items-center justify-between'>
                <div className='flex items-center gap-4'>
                  <div className='relative w-16 h-16 bg-gray-100 rounded'>
                    <Image
                      src={item.image || "/images/placeholder.png"}
                      alt={item.name}
                      fill
                      style={{ objectFit: "contain" }}
                    />
                    <span className='absolute -top-2 -right-2 bg-gray-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center'>
                      {item.qty}
                    </span>
                  </div>
                  <div>
                    <div className='font-semibold'>{item.name}</div>
                    <div className='text-sm text-gray-600'>
                      ${item.price.toFixed(2)}
                    </div>
                  </div>
                </div>
                <div className='font-medium'>
                  ${(item.price * item.qty).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
          <div className='border-t pt-4 space-y-2'>
            <div className='flex justify-between'>
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className='flex justify-between'>
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className='flex justify-between font-bold text-lg'>
              <span>Total</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
