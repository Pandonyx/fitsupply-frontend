import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { fetchProducts } from "@/store/slices/productSlice";
import type { RootState, AppDispatch } from "@/store";

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const { items: products, status } = useSelector((s: RootState) => s.products);

  useEffect(() => {
    // Only fetch products if they haven't been fetched yet
    if (status === "idle") {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  return (
    <main className='container mx-auto p-4'>
      {/* Hero Section */}
      <section className='text-center my-10 p-6 bg-blue-700 rounded-lg'>
        <h1 className='text-4xl font-bold text-gray-100 mb-2'>
          Welcome to FitSupply
        </h1>
        <p className='text-lg text-gray-50 mb-6'>
          Your one-stop shop for premium fitness supplements.
        </p>
        <Link
          href='/products'
          className='bg-black text-white px-6 py-3 rounded-md font-semibold hover:bg-gray-800 transition-colors'>
          Shop All Products
        </Link>
      </section>

      {/* Featured Products Section */}
      <section>
        <h2 className='text-3xl font-bold mb-6 text-center'>
          Featured Products
        </h2>
        {status === "loading" && <div className='text-center'>Loading...</div>}
        {status === "failed" && (
          <div className='text-center text-red-500'>
            Error loading products.
          </div>
        )}
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
          {products.slice(0, 4).map((p) => (
            <ProductCard
              key={p.id}
              product={p}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
