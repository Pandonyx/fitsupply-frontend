import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { fetchProducts } from "@/store/slices/productSlice";
import type { RootState, AppDispatch } from "@/store";

interface Category {
  id: string | number;
  name: string;
}

export default function CategoryPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { items, status } = useSelector((s: RootState) => s.products);
  const [sortBy, setSortBy] = useState("featured");
  const [categories, setCategories] = useState<Category[]>([]);

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  // Get the category name from the URL query parameters
  const { category } = router.query;
  const categoryName =
    typeof category === "string" ? decodeURIComponent(category) : "";

  useEffect(() => {
    // Fetch products if they haven't been loaded yet
    if (status === "idle") {
      dispatch(fetchProducts());
    }
    // Fetch categories for navigation
    fetchCategories();
  }, [dispatch, status]);

  // Fetch categories from backend
  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/categories/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const categoriesData = await response.json();
        setCategories(categoriesData.results || categoriesData);
      } else {
        // Fallback: extract unique categories from products
        extractCategoriesFromProducts();
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      // Fallback: extract unique categories from products
      extractCategoriesFromProducts();
    }
  };

  // Fallback method to extract categories from products
  const extractCategoriesFromProducts = () => {
    if (!items) return;

    const uniqueCategories = [
      ...new Map(
        items
          .map((p) => {
            // Handle both object and string category formats
            if (typeof p.category === "object" && p.category?.name) {
              return { id: p.category.id, name: p.category.name };
            }
            if (typeof p.category === "string") {
              return { id: p.category, name: p.category };
            }
            return null;
          })
          .filter(Boolean)
          .map((cat) => [cat!.id, cat!])
      ).values(),
    ];

    setCategories(uniqueCategories);
  };

  // Extract categories from products when items change (fallback)
  useEffect(() => {
    if (items.length > 0 && categories.length === 0) {
      extractCategoriesFromProducts();
    }
  }, [items]);

  // Helper function to get category name consistently
  const getCategoryName = (product: any): string => {
    if (typeof product.category === "object" && product.category?.name) {
      return product.category.name;
    }
    if (typeof product.category === "string") {
      return product.category;
    }
    return "Uncategorized";
  };

  // Filter products based on the current category and sort them
  const filteredItems = useMemo(() => {
    if (!items || !categoryName) return [];

    let filtered = items.filter((product) => {
      const productCategory = getCategoryName(product);
      return productCategory === categoryName;
    });

    // Sort products
    switch (sortBy) {
      case "price-low":
        return filtered.sort((a, b) => Number(a.price) - Number(b.price));
      case "price-high":
        return filtered.sort((a, b) => Number(b.price) - Number(a.price));
      case "name-az":
        return filtered.sort((a, b) => a.name.localeCompare(b.name));
      case "name-za":
        return filtered.sort((a, b) => b.name.localeCompare(a.name));
      case "featured":
      default:
        // Sort by featured status if available, then by original order
        return filtered.sort((a, b) => {
          if (a.is_featured && !b.is_featured) return -1;
          if (!a.is_featured && b.is_featured) return 1;
          return 0;
        });
    }
  }, [items, categoryName, sortBy]);

  // Get other categories for navigation (excluding current category)
  const otherCategories = useMemo(() => {
    return categories.filter((cat) => cat.name !== categoryName);
  }, [categories, categoryName]);

  if (router.isFallback) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600'></div>
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div className='min-h-screen bg-gray-50'>
        <div className='container mx-auto px-6 py-8'>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className='bg-white rounded-lg shadow-sm p-4 animate-pulse'>
                <div className='h-48 bg-gray-200 rounded mb-4'></div>
                <div className='h-4 bg-gray-200 rounded mb-2'></div>
                <div className='h-4 bg-gray-200 rounded w-2/3 mb-2'></div>
                <div className='h-6 bg-gray-200 rounded w-1/3'></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className='min-h-screen bg-gray-50'>
      {/* Breadcrumb */}
      <div className='bg-white border-b'>
        <div className='container mx-auto px-6 py-4'>
          <nav className='flex items-center space-x-2 text-sm text-gray-600'>
            <Link
              href='/'
              className='hover:text-blue-600'>
              Home
            </Link>
            <span>/</span>
            <Link
              href='/products'
              className='hover:text-blue-600'>
              Products
            </Link>
            <span>/</span>
            <span className='text-gray-800 capitalize'>{categoryName}</span>
          </nav>
        </div>
      </div>

      {/* Page Header */}
      <section className='bg-white shadow-sm border-b'>
        <div className='container mx-auto px-6 py-8'>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-4xl font-bold text-gray-800 mb-2 capitalize'>
                {categoryName}
              </h1>
              <p className='text-lg text-gray-600'>
                Browse our premium {categoryName.toLowerCase()} collection
              </p>
            </div>
            <div className='text-right'>
              <p className='text-2xl font-bold text-blue-600'>
                {filteredItems.length}
              </p>
              <p className='text-sm text-gray-600'>Products</p>
            </div>
          </div>
        </div>
      </section>

      <div className='container mx-auto px-6 py-8'>
        <div className='flex flex-col lg:flex-row gap-8'>
          {/* Sidebar */}
          <aside className='lg:w-64 flex-shrink-0'>
            <div className='bg-white rounded-lg shadow-sm p-6 sticky top-4'>
              {/* Current Category */}
              <div className='mb-6'>
                <h3 className='text-lg font-semibold text-gray-800 mb-4'>
                  Current Category
                </h3>
                <div className='bg-blue-100 text-blue-800 px-3 py-2 rounded-lg font-medium'>
                  {categoryName} ({filteredItems.length})
                </div>
              </div>

              {/* Other Categories */}
              <div className='mb-6'>
                <h3 className='text-lg font-semibold text-gray-800 mb-4'>
                  Other Categories
                </h3>
                <div className='space-y-2'>
                  <Link
                    href='/products'
                    className='block w-full text-left px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors'>
                    All Products
                  </Link>
                  {otherCategories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/products/category/${encodeURIComponent(
                        cat.name
                      )}`}
                      className='block w-full text-left px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors'>
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <h3 className='text-lg font-semibold text-gray-800 mb-4'>
                  Quick Actions
                </h3>
                <div className='space-y-2'>
                  <Link
                    href='/products'
                    className='block w-full text-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm'>
                    View All Products
                  </Link>
                  <button
                    onClick={() =>
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }
                    className='block w-full text-center px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm'>
                    Back to Top
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className='flex-1'>
            {/* Results Header */}
            <div className='flex justify-between items-center mb-6'>
              <div>
                <p className='text-gray-600'>
                  Showing {filteredItems.length} products in{" "}
                  <span className='font-medium text-gray-800'>
                    {categoryName}
                  </span>
                </p>
              </div>

              {/* Sort Options */}
              <select
                className='border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white'
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}>
                <option value='featured'>Sort by Featured</option>
                <option value='price-low'>Price: Low to High</option>
                <option value='price-high'>Price: High to Low</option>
                <option value='name-az'>Name: A to Z</option>
                <option value='name-za'>Name: Z to A</option>
              </select>
            </div>

            {/* Error State */}
            {status === "failed" && (
              <div className='bg-white rounded-lg shadow-sm p-8 text-center'>
                <div className='text-red-500 mb-4'>
                  <svg
                    className='w-12 h-12 mx-auto'
                    fill='currentColor'
                    viewBox='0 0 20 20'>
                    <path
                      fillRule='evenodd'
                      d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                      clipRule='evenodd'
                    />
                  </svg>
                </div>
                <h3 className='text-lg font-semibold text-gray-800 mb-2'>
                  Failed to load products
                </h3>
                <p className='text-gray-600 mb-4'>
                  There was an error loading products. Please try again.
                </p>
                <button
                  onClick={() => dispatch(fetchProducts())}
                  className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700'>
                  Retry
                </button>
              </div>
            )}

            {/* No Results */}
            {status === "succeeded" && filteredItems.length === 0 && (
              <div className='bg-white rounded-lg shadow-sm p-8 text-center'>
                <div className='text-gray-400 mb-4'>
                  <svg
                    className='w-16 h-16 mx-auto'
                    fill='currentColor'
                    viewBox='0 0 20 20'>
                    <path
                      fillRule='evenodd'
                      d='M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z'
                      clipRule='evenodd'
                    />
                  </svg>
                </div>
                <h3 className='text-lg font-semibold text-gray-800 mb-2'>
                  No products found in {categoryName}
                </h3>
                <p className='text-gray-600 mb-4'>
                  This category doesn't have any products yet.
                </p>
                <Link
                  href='/products'
                  className='inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700'>
                  Browse All Products
                </Link>
              </div>
            )}

            {/* Products Grid */}
            {status === "succeeded" && filteredItems.length > 0 && (
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                {filteredItems.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
