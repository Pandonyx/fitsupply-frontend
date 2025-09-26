import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { fetchProducts } from "@/store/slices/productSlice";
import type { RootState, AppDispatch } from "@/store";
import ProductCard from "@/components/ProductCard";

export default function ProductsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { items, status } = useSelector((s: RootState) => s.products);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Handle URL category parameter
  useEffect(() => {
    const { category } = router.query;
    if (category && typeof category === "string") {
      setSelectedCategory(category);
    }
  }, [router.query]);

  // Get unique categories from products
  const categories = useMemo(() => {
    if (!items) return [];
    const uniqueCategories = [
      ...new Set(
        items.map((p) => p.category?.name || p.category).filter(Boolean)
      ),
    ];
    return ["All", ...uniqueCategories];
  }, [items]);

  // Filter and sort products based on search, category, and sort option
  const filteredItems = useMemo(() => {
    let filtered = items
      .filter((product) => {
        // Filter by search term
        const matchesSearch =
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
      })
      .filter((product) => {
        // Filter by category
        if (selectedCategory === "All") return true;
        const productCategory = product.category?.name || product.category;
        return productCategory === selectedCategory;
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
        // Keep original order or sort by featured status if available
        return filtered;
    }
  }, [items, searchTerm, selectedCategory, sortBy]);

  // Handle category change
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    // Update URL without page reload
    const query = category === "All" ? {} : { category };
    router.push({ pathname: "/products", query }, undefined, { shallow: true });
  };

  // Get category counts for display
  const categoryCounts = useMemo(() => {
    const counts: { [key: string]: number } = {};
    items.forEach((product) => {
      const category =
        product.category?.name || product.category || "Uncategorized";
      counts[category] = (counts[category] || 0) + 1;
    });
    return counts;
  }, [items]);

  return (
    <main className='min-h-screen bg-gray-50'>
      {/* Page Header */}
      <section className='bg-white shadow-sm border-b'>
        <div className='container mx-auto px-6 py-8'>
          <h1 className='text-4xl font-bold text-gray-800 mb-2'>
            Our Products
          </h1>
          <p className='text-lg text-gray-600'>
            Discover premium fitness supplements to fuel your performance
          </p>
        </div>
      </section>

      <div className='container mx-auto px-6 py-8'>
        <div className='flex flex-col lg:flex-row gap-8'>
          {/* Sidebar Filters */}
          <aside className='lg:w-64 flex-shrink-0'>
            <div className='bg-white rounded-lg shadow-sm p-6 sticky top-4'>
              {/* Search */}
              <div className='mb-6'>
                <label
                  htmlFor='search'
                  className='block text-sm font-medium text-gray-700 mb-2'>
                  Search Products
                </label>
                <input
                  id='search'
                  type='text'
                  placeholder='Search supplements...'
                  className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Categories */}
              <div>
                <h3 className='text-lg font-semibold text-gray-800 mb-4'>
                  Categories
                </h3>
                <div className='space-y-2'>
                  {categories.map((category) => {
                    const count =
                      category === "All"
                        ? items.length
                        : categoryCounts[category] || 0;

                    return (
                      <button
                        key={category}
                        onClick={() => handleCategoryChange(category)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex justify-between items-center ${
                          selectedCategory === category
                            ? "bg-blue-100 text-blue-800 font-medium"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}>
                        <span>{category}</span>
                        <span
                          className={`text-sm ${
                            selectedCategory === category
                              ? "text-blue-600"
                              : "text-gray-500"
                          }`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Filter Summary */}
              {(searchTerm || selectedCategory !== "All") && (
                <div className='mt-6 pt-6 border-t border-gray-200'>
                  <h4 className='text-sm font-medium text-gray-700 mb-2'>
                    Active Filters:
                  </h4>
                  <div className='space-y-1'>
                    {selectedCategory !== "All" && (
                      <span className='inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded'>
                        {selectedCategory}
                      </span>
                    )}
                    {searchTerm && (
                      <span className='inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded'>
                        "{searchTerm}"
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      handleCategoryChange("All");
                    }}
                    className='text-sm text-gray-500 hover:text-gray-700 mt-2'>
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          </aside>

          {/* Products Grid */}
          <div className='flex-1'>
            {/* Results Header */}
            <div className='flex justify-between items-center mb-6'>
              <div>
                <p className='text-gray-600'>
                  Showing {filteredItems.length} of {items.length} products
                  {selectedCategory !== "All" && (
                    <span className='text-blue-600 font-medium'>
                      {" "}
                      in {selectedCategory}
                    </span>
                  )}
                </p>
              </div>

              {/* Sort Options */}
              <select
                className='border border-gray-300 rounded-lg px-3 py-2 text-sm'
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}>
                <option value='featured'>Sort by Featured</option>
                <option value='price-low'>Price: Low to High</option>
                <option value='price-high'>Price: High to Low</option>
                <option value='name-az'>Name: A to Z</option>
                <option value='name-za'>Name: Z to A</option>
              </select>
            </div>

            {/* Loading State */}
            {status === "loading" && (
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
            )}

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
                  There was an error loading the products. Please try again.
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
                  No products found
                </h3>
                <p className='text-gray-600 mb-4'>
                  Try adjusting your search terms or category filter
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    handleCategoryChange("All");
                  }}
                  className='text-blue-600 hover:text-blue-800 font-medium'>
                  View all products
                </button>
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
