// pages/checkout.tsx
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import Image from "next/image";
import { RootState, AppDispatch } from "@/store";
import { clearCart } from "@/store/slices/cartSlice";

interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface PaymentInfo {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  nameOnCard: string;
}

export default function CheckoutPage() {
  const { items, status } = useSelector((s: RootState) => s.cart);
  const { user, isAuthenticated } = useSelector((s: RootState) => s.auth);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sameAsBilling, setSameAsBilling] = useState(true);
  const [hasCheckedCart, setHasCheckedCart] = useState(false);

  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: user?.first_name || "",
    lastName: user?.last_name || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
  });

  const [billingInfo, setBillingInfo] = useState<ShippingInfo>({
    firstName: user?.first_name || "",
    lastName: user?.last_name || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
  });

  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    nameOnCard: `${user?.first_name || ""} ${user?.last_name || ""}`.trim(),
  });

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  // Redirect if cart is empty, but only after we've checked the cart status
  useEffect(() => {
    if (status !== "loading" && !hasCheckedCart) {
      setHasCheckedCart(true);
      if (items.length === 0) {
        console.log("Cart is empty, redirecting to cart page");
        router.push("/cart");
      }
    }
  }, [items, status, router, hasCheckedCart]);

  // Calculate totals
  const subtotal = items.reduce(
    (sum, item) => sum + item.qty * Number(item.price),
    0
  );
  const shipping = 0; // Free shipping
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Copy shipping to billing if same address
    if (sameAsBilling) {
      setBillingInfo({ ...shippingInfo });
    }

    setCurrentStep(2);
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Simulate payment processing
      await processPayment();

      // Create order
      await createOrder();

      // Clear cart
      dispatch(clearCart());

      // Redirect to success page
      router.push("/order-confirmation");
    } catch (error) {
      console.error("Payment failed:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const processPayment = async () => {
    // Simulate Stripe payment processing
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Remove spaces from card number for comparison
        const cleanCardNumber = paymentInfo.cardNumber.replace(/\s/g, "");

        // Test card numbers for demo
        if (cleanCardNumber === "4242424242424242") {
          resolve("Payment successful");
        } else if (cleanCardNumber === "4000000000000002") {
          reject("Card declined");
        } else if (cleanCardNumber === "4000000000009995") {
          reject("Insufficient funds");
        } else {
          resolve("Payment successful"); // Default to success for demo
        }
      }, 2000);
    });
  };

  const createOrder = async () => {
    const orderData = {
      items: items.map((item) => ({
        product_id: item.productId,
        quantity: item.qty,
        price: item.price,
      })),
      shipping_address: `${shippingInfo.firstName} ${shippingInfo.lastName}\n${shippingInfo.address}\n${shippingInfo.city}, ${shippingInfo.state} ${shippingInfo.zipCode}\n${shippingInfo.country}`,
      billing_address: sameAsBilling
        ? `${shippingInfo.firstName} ${shippingInfo.lastName}\n${shippingInfo.address}\n${shippingInfo.city}, ${shippingInfo.state} ${shippingInfo.zipCode}\n${shippingInfo.country}`
        : `${billingInfo.firstName} ${billingInfo.lastName}\n${billingInfo.address}\n${billingInfo.city}, ${billingInfo.state} ${billingInfo.zipCode}\n${billingInfo.country}`,
      payment_method: "credit_card",
      total_amount: total.toFixed(2),
      notes: `Phone: ${shippingInfo.phone}`,
    };

    console.log("Creating order with data:", orderData);

    const response = await fetch(`${API_BASE_URL}/api/v1/orders/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(orderData),
    });

    console.log("Order creation response status:", response.status);

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Order creation failed:", errorData);
      throw new Error(`Failed to create order: ${errorData}`);
    }

    const result = await response.json();
    console.log("Order created successfully:", result);
    return result;
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(" ") : v;
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return v;
  };

  if (status === "loading" || !hasCheckedCart) {
    return (
      <main className='min-h-screen bg-gray-50 py-8'>
        <div className='container mx-auto px-4 text-center'>
          <div className='text-center'>Loading checkout...</div>
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className='min-h-screen bg-gray-50 py-8'>
        <div className='container mx-auto px-4 text-center'>
          <div className='text-center'>Redirecting...</div>
        </div>
      </main>
    );
  }

  return (
    <main className='min-h-screen bg-gray-50 py-8'>
      <div className='container mx-auto px-4'>
        <h1 className='text-3xl font-bold text-center mb-8'>Checkout</h1>

        {/* Progress Steps */}
        <div className='flex justify-center mb-8'>
          <div className='flex items-center space-x-4'>
            <div
              className={`flex items-center ${
                currentStep >= 1 ? "text-blue-600" : "text-gray-400"
              }`}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep >= 1 ? "bg-blue-600 text-white" : "bg-gray-300"
                }`}>
                1
              </div>
              <span className='ml-2'>Shipping</span>
            </div>
            <div className='w-8 h-0.5 bg-gray-300'></div>
            <div
              className={`flex items-center ${
                currentStep >= 2 ? "text-blue-600" : "text-gray-400"
              }`}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep >= 2 ? "bg-blue-600 text-white" : "bg-gray-300"
                }`}>
                2
              </div>
              <span className='ml-2'>Payment</span>
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Main Content */}
          <div className='lg:col-span-2'>
            {currentStep === 1 && (
              <div className='bg-white p-6 rounded-lg shadow-sm'>
                <h2 className='text-xl font-semibold mb-6'>
                  Shipping Information
                </h2>
                <form
                  onSubmit={handleShippingSubmit}
                  className='space-y-4'>
                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        First Name *
                      </label>
                      <input
                        type='text'
                        required
                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        value={shippingInfo.firstName}
                        onChange={(e) =>
                          setShippingInfo({
                            ...shippingInfo,
                            firstName: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Last Name *
                      </label>
                      <input
                        type='text'
                        required
                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        value={shippingInfo.lastName}
                        onChange={(e) =>
                          setShippingInfo({
                            ...shippingInfo,
                            lastName: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Email *
                      </label>
                      <input
                        type='email'
                        required
                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        value={shippingInfo.email}
                        onChange={(e) =>
                          setShippingInfo({
                            ...shippingInfo,
                            email: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Phone *
                      </label>
                      <input
                        type='tel'
                        required
                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        value={shippingInfo.phone}
                        onChange={(e) =>
                          setShippingInfo({
                            ...shippingInfo,
                            phone: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Address *
                    </label>
                    <input
                      type='text'
                      required
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                      value={shippingInfo.address}
                      onChange={(e) =>
                        setShippingInfo({
                          ...shippingInfo,
                          address: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className='grid grid-cols-3 gap-4'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        City *
                      </label>
                      <input
                        type='text'
                        required
                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        value={shippingInfo.city}
                        onChange={(e) =>
                          setShippingInfo({
                            ...shippingInfo,
                            city: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        State *
                      </label>
                      <input
                        type='text'
                        required
                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        value={shippingInfo.state}
                        onChange={(e) =>
                          setShippingInfo({
                            ...shippingInfo,
                            state: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        ZIP Code *
                      </label>
                      <input
                        type='text'
                        required
                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        value={shippingInfo.zipCode}
                        onChange={(e) =>
                          setShippingInfo({
                            ...shippingInfo,
                            zipCode: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className='flex items-center'>
                    <input
                      type='checkbox'
                      id='sameAsBilling'
                      checked={sameAsBilling}
                      onChange={(e) => setSameAsBilling(e.target.checked)}
                      className='mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
                    />
                    <label
                      htmlFor='sameAsBilling'
                      className='text-sm text-gray-700'>
                      Billing address is the same as shipping address
                    </label>
                  </div>

                  <button
                    type='submit'
                    className='w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors font-semibold'>
                    Continue to Payment
                  </button>
                </form>
              </div>
            )}

            {currentStep === 2 && (
              <div className='bg-white p-6 rounded-lg shadow-sm'>
                <h2 className='text-xl font-semibold mb-6'>
                  Payment Information
                </h2>

                {/* Test Card Info */}
                <div className='bg-blue-50 p-4 rounded-lg mb-6'>
                  <h3 className='font-semibold text-blue-800 mb-2'>
                    Test Card Numbers:
                  </h3>
                  <div className='text-sm text-blue-700 space-y-1'>
                    <p>
                      <strong>Success:</strong> 4242 4242 4242 4242
                    </p>
                    <p>
                      <strong>Declined:</strong> 4000 0000 0000 0002
                    </p>
                    <p>
                      <strong>Insufficient Funds:</strong> 4000 0000 0000 9995
                    </p>
                    <p>
                      <strong>Expiry:</strong> Any future date |{" "}
                      <strong>CVV:</strong> Any 3 digits
                    </p>
                  </div>
                </div>

                <form
                  onSubmit={handlePaymentSubmit}
                  className='space-y-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Name on Card *
                    </label>
                    <input
                      type='text'
                      required
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                      value={paymentInfo.nameOnCard}
                      onChange={(e) =>
                        setPaymentInfo({
                          ...paymentInfo,
                          nameOnCard: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Card Number *
                    </label>
                    <input
                      type='text'
                      required
                      maxLength={19}
                      placeholder='1234 5678 9012 3456'
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                      value={paymentInfo.cardNumber}
                      onChange={(e) =>
                        setPaymentInfo({
                          ...paymentInfo,
                          cardNumber: formatCardNumber(e.target.value),
                        })
                      }
                    />
                  </div>

                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Expiry Date *
                      </label>
                      <input
                        type='text'
                        required
                        maxLength={5}
                        placeholder='MM/YY'
                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        value={paymentInfo.expiryDate}
                        onChange={(e) =>
                          setPaymentInfo({
                            ...paymentInfo,
                            expiryDate: formatExpiryDate(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        CVV *
                      </label>
                      <input
                        type='text'
                        required
                        maxLength={3}
                        placeholder='123'
                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        value={paymentInfo.cvv}
                        onChange={(e) =>
                          setPaymentInfo({
                            ...paymentInfo,
                            cvv: e.target.value.replace(/[^0-9]/g, ""),
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className='flex space-x-4 pt-4'>
                    <button
                      type='button'
                      onClick={() => setCurrentStep(1)}
                      className='flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-300 transition-colors font-semibold'>
                      Back to Shipping
                    </button>
                    <button
                      type='submit'
                      disabled={isProcessing}
                      className='flex-1 bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition-colors font-semibold disabled:bg-gray-400'>
                      {isProcessing
                        ? "Processing..."
                        : `Pay $${total.toFixed(2)}`}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className='bg-white p-6 rounded-lg shadow-sm h-fit'>
            <h2 className='text-xl font-semibold mb-4'>Order Summary</h2>

            {/* Items */}
            <div className='space-y-3 mb-4'>
              {items.map((item) => (
                <div
                  key={item.productId}
                  className='flex items-center space-x-3'>
                  <div className='relative w-12 h-12 bg-gray-100 rounded'>
                    <Image
                      src={item.image || "/placeholder.png"}
                      alt={item.name}
                      fill
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                  <div className='flex-1'>
                    <p className='font-medium text-sm'>{item.name}</p>
                    <p className='text-xs text-gray-600'>Qty: {item.qty}</p>
                  </div>
                  <p className='font-medium text-sm'>
                    ${(item.qty * Number(item.price)).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className='border-t pt-4 space-y-2'>
              <div className='flex justify-between text-sm'>
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className='flex justify-between text-sm'>
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className='flex justify-between text-sm'>
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className='flex justify-between font-bold text-lg border-t pt-2'>
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
