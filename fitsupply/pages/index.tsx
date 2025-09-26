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
    if (status === "idle") {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  // Get featured products (first 4 for now, later you can add is_featured filtering)
  const featuredProducts = products.slice(0, 4);

  return (
    <main className='bg-gray-50 min-h-screen'>
      {/* Hero Section */}
      <section className='relative bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white'>
        <div className='absolute inset-0 bg-black opacity-20'></div>
        <div className='relative container mx-auto px-6 py-20 text-center'>
          <h1 className='text-5xl md:text-6xl font-bold mb-6'>
            Fuel Your <span className='text-blue-300'>Fitness</span> Journey
          </h1>
          <p className='text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto'>
            Premium supplements crafted for athletes and fitness enthusiasts.
            Build strength, enhance performance, and achieve your goals.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Link
              href='/products'
              className='bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors shadow-lg'>
              Shop All Products
            </Link>
            <Link
              href='/products?category=protein-supplements'
              className='bg-transparent border-2 border-white hover:bg-white hover:text-blue-900 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors'>
              Browse Protein
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Preview */}
      <section className='py-16 bg-white'>
        <div className='container mx-auto px-6'>
          <h2 className='text-4xl font-bold text-center mb-12 text-gray-800'>
            Shop by Category
          </h2>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
            {[
              {
                name: "Protein",
                slug: "protein-supplements",
                icon: "💪",
                color: "bg-red-500",
              },
              {
                name: "Pre-Workout",
                slug: "pre-workout",
                icon: "⚡",
                color: "bg-orange-500",
              },
              {
                name: "Vitamins",
                slug: "vitamins-minerals",
                icon: "🌿",
                color: "bg-green-500",
              },
              {
                name: "Recovery",
                slug: "post-workout-recovery",
                icon: "🔄",
                color: "bg-blue-500",
              },
            ].map((category, index) => (
              <Link
                key={index}
                href={`/products?category=${category.slug}`}
                className='group'>
                <div
                  className={`${category.color} text-white p-6 rounded-xl text-center hover:shadow-lg transition-all duration-300 group-hover:scale-105`}>
                  <div className='text-4xl mb-3'>{category.icon}</div>
                  <h3 className='font-semibold text-lg'>{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className='py-16 bg-gray-50'>
        <div className='container mx-auto px-6'>
          <div className='text-center mb-12'>
            <h2 className='text-4xl font-bold mb-4 text-gray-800'>
              Featured Products
            </h2>
            <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
              Discover our top-rated supplements trusted by athletes and fitness
              enthusiasts worldwide
            </p>
          </div>

          {status === "loading" && (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className='bg-white rounded-lg shadow-md p-6 animate-pulse'>
                  <div className='h-48 bg-gray-200 rounded mb-4'></div>
                  <div className='h-4 bg-gray-200 rounded mb-2'></div>
                  <div className='h-4 bg-gray-200 rounded w-2/3'></div>
                </div>
              ))}
            </div>
          )}

          {status === "failed" && (
            <div className='text-center text-red-500 py-8'>
              <p>Unable to load featured products. Please try again later.</p>
            </div>
          )}

          {status === "succeeded" && (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          )}

          <div className='text-center'>
            <Link
              href='/products'
              className='inline-block bg-gray-800 hover:bg-gray-900 text-white font-semibold py-3 px-8 rounded-lg transition-colors'>
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='py-16 bg-white'>
        <div className='container mx-auto px-6'>
          <h2 className='text-4xl font-bold text-center mb-12 text-gray-800'>
            Why Choose FitSupply?
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <div className='text-center p-6'>
              <div className='bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4'>
                <svg
                  className='w-8 h-8 text-blue-600'
                  fill='currentColor'
                  viewBox='0 0 20 20'>
                  <path
                    fillRule='evenodd'
                    d='M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                    clipRule='evenodd'
                  />
                </svg>
              </div>
              <h3 className='text-xl font-semibold mb-2'>Premium Quality</h3>
              <p className='text-gray-600'>
                Third-party tested supplements with the highest quality
                ingredients
              </p>
            </div>
            <div className='text-center p-6'>
              <div className='bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4'>
                <svg
                  className='w-8 h-8 text-green-600'
                  fill='currentColor'
                  viewBox='0 0 20 20'>
                  <path
                    fillRule='evenodd'
                    d='M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z'
                    clipRule='evenodd'
                  />
                </svg>
              </div>
              <h3 className='text-xl font-semibold mb-2'>Expert Approved</h3>
              <p className='text-gray-600'>
                Formulated by nutritionists and trusted by professional athletes
              </p>
            </div>
            <div className='text-center p-6'>
              <div className='bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4'>
                <svg
                  className='w-8 h-8 text-purple-600'
                  fill='currentColor'
                  viewBox='0 0 20 20'>
                  <path d='M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z' />
                </svg>
              </div>
              <h3 className='text-xl font-semibold mb-2'>Fast Shipping</h3>
              <p className='text-gray-600'>
                Free shipping on orders over $50 with fast, reliable delivery
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
