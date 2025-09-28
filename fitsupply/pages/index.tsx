import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { fetchProducts } from "@/store/slices/productSlice";
import type { RootState, AppDispatch } from "@/store";

// Loading skeleton component
const ProductCardSkeleton = () => (
  <div className='bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm animate-pulse'>
    <div className='h-56 bg-gray-200'></div>
    <div className='p-4'>
      <div className='h-5 bg-gray-200 rounded mb-2'></div>
      <div className='h-4 bg-gray-200 rounded w-2/3 mb-3'></div>
      <div className='flex justify-between items-center'>
        <div className='h-6 bg-gray-200 rounded w-1/3'></div>
        <div className='h-8 bg-gray-200 rounded-full w-1/4'></div>
      </div>
    </div>
  </div>
);

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
      <section className='relative bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white overflow-hidden'>
        <div className='absolute inset-0 bg-black opacity-20'></div>
        {/* Add subtle pattern overlay */}
        <div className='absolute inset-0 opacity-10'>
          <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent transform rotate-12 translate-x-full animate-pulse'></div>
        </div>
        <div className='relative container mx-auto px-6 py-24 text-center'>
          <h1 className='text-5xl md:text-7xl font-black mb-6 leading-tight'>
            Fuel Your{" "}
            <span className='text-yellow-400 drop-shadow-lg'>Performance</span>
          </h1>
          <p className='text-xl md:text-2xl mb-10 text-blue-100 max-w-3xl mx-auto leading-relaxed'>
            Premium sports supplements engineered for athletes who demand
            excellence. Build strength, enhance performance, and achieve your
            goals.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Link
              href='/products'
              className='bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105'>
              Shop Now
            </Link>
            <Link
              href='/products'
              className='bg-transparent border-2 border-white hover:bg-white hover:text-blue-900 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300'>
              Browse Catalog
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Preview */}
      <section className='py-20 bg-white'>
        <div className='container mx-auto px-6'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl md:text-5xl font-bold mb-4 text-gray-800'>
              Shop by Category
            </h2>
            <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
              Find the perfect supplements for your fitness goals
            </p>
          </div>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
            {[
              {
                name: "Protein",
                slug: "protein-supplements",
                icon: "💪",
                color: "bg-gradient-to-br from-red-500 to-red-600",
                description: "Build & Recover",
              },
              {
                name: "Pre-Workout",
                slug: "pre-workout",
                icon: "⚡",
                color: "bg-gradient-to-br from-orange-500 to-orange-600",
                description: "Energy & Focus",
              },
              {
                name: "Vitamins",
                slug: "vitamins-minerals",
                icon: "🌿",
                color: "bg-gradient-to-br from-green-500 to-green-600",
                description: "Health & Wellness",
              },
              {
                name: "Recovery",
                slug: "post-workout-recovery",
                icon: "🔄",
                color: "bg-gradient-to-br from-blue-500 to-blue-600",
                description: "Rest & Repair",
              },
            ].map((category, index) => (
              <Link
                key={index}
                href={`/products?category=${category.slug}`}
                className='group'>
                <div
                  className={`${category.color} text-white p-6 rounded-2xl text-center hover:shadow-2xl transition-all duration-300 group-hover:scale-105 group-hover:-translate-y-2`}>
                  <div className='text-5xl mb-4'>{category.icon}</div>
                  <h3 className='font-bold text-xl mb-2'>{category.name}</h3>
                  <p className='text-sm opacity-90'>{category.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className='py-20 bg-gray-50'>
        <div className='container mx-auto px-6'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl md:text-5xl font-bold mb-4 text-gray-800'>
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
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          )}

          {status === "failed" && (
            <div className='text-center text-red-500 py-8'>
              <div className='bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto'>
                <svg
                  className='w-12 h-12 text-red-400 mx-auto mb-4'
                  fill='currentColor'
                  viewBox='0 0 20 20'>
                  <path
                    fillRule='evenodd'
                    d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                    clipRule='evenodd'
                  />
                </svg>
                <p className='text-red-600 font-medium'>
                  Unable to load featured products
                </p>
                <p className='text-red-500 text-sm mt-1'>
                  Please try again later
                </p>
              </div>
            </div>
          )}

          {status === "succeeded" && (
            <>
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12'>
                {featuredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                ))}
              </div>
              <div className='text-center'>
                <Link
                  href='/products'
                  className='inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105'>
                  View All Products
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className='py-20 bg-white'>
        <div className='container mx-auto px-6'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl md:text-5xl font-bold mb-4 text-gray-800'>
              Why Choose FitSupply?
            </h2>
            <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
              We're committed to providing the highest quality supplements to
              fuel your fitness journey
            </p>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <div className='text-center p-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl hover:shadow-lg transition-all duration-300'>
              <div className='bg-blue-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg'>
                <svg
                  className='w-10 h-10 text-white'
                  fill='currentColor'
                  viewBox='0 0 20 20'>
                  <path
                    fillRule='evenodd'
                    d='M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                    clipRule='evenodd'
                  />
                </svg>
              </div>
              <h3 className='text-2xl font-bold mb-4 text-gray-800'>
                Premium Quality
              </h3>
              <p className='text-gray-600 leading-relaxed'>
                Third-party tested supplements with the highest quality
                ingredients sourced from trusted suppliers worldwide
              </p>
            </div>
            <div className='text-center p-8 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl hover:shadow-lg transition-all duration-300'>
              <div className='bg-green-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg'>
                <svg
                  className='w-10 h-10 text-white'
                  fill='currentColor'
                  viewBox='0 0 20 20'>
                  <path
                    fillRule='evenodd'
                    d='M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z'
                    clipRule='evenodd'
                  />
                </svg>
              </div>
              <h3 className='text-2xl font-bold mb-4 text-gray-800'>
                Expert Approved
              </h3>
              <p className='text-gray-600 leading-relaxed'>
                Formulated by certified nutritionists and trusted by
                professional athletes across multiple sports disciplines
              </p>
            </div>
            <div className='text-center p-8 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl hover:shadow-lg transition-all duration-300'>
              <div className='bg-purple-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg'>
                <svg
                  className='w-10 h-10 text-white'
                  fill='currentColor'
                  viewBox='0 0 20 20'>
                  <path d='M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z' />
                </svg>
              </div>
              <h3 className='text-2xl font-bold mb-4 text-gray-800'>
                Fast Shipping
              </h3>
              <p className='text-gray-600 leading-relaxed'>
                Free shipping on orders over $50 with fast, reliable delivery to
                get your supplements when you need them
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className='py-20 bg-gradient-to-r from-blue-600 to-blue-700'>
        <div className='container mx-auto px-6 text-center'>
          <div className='max-w-3xl mx-auto'>
            <h2 className='text-4xl font-bold text-white mb-4'>Stay Updated</h2>
            <p className='text-xl text-blue-100 mb-8'>
              Get the latest fitness tips, product updates, and exclusive offers
              delivered to your inbox
            </p>
            <div className='flex flex-col sm:flex-row gap-4 max-w-md mx-auto'>
              <input
                type='email'
                placeholder='Enter your email'
                className='flex-1 px-6 py-4 rounded-lg text-gray-900 placeholder-white border-2 border-blue-300 focus:outline-none focus:ring-4 focus:ring-blue-300'
              />
              <button className='bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-bold px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105'>
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
