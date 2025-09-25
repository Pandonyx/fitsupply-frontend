import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "@/store/slices/productSlice";
import type { RootState, AppDispatch } from "@/store";
import ProductCard from "@/components/ProductCard";

export default function ProductsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, status } = useSelector((s: RootState) => s.products);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    // Fetch all products when the component mounts
    dispatch(fetchProducts());
  }, [dispatch]);

  const categories = useMemo(() => {
    if (!items) return [];
    // Create a unique list of categories from the products
    const uniqueCategories = [
      ...new Set(items.map((p) => p.category).filter(Boolean)),
    ];
    return ["All", ...uniqueCategories];
  }, [items]);

  const filteredItems = useMemo(() => {
    return items
      .filter((product) => {
        // Filter by search term
        return product.name.toLowerCase().includes(searchTerm.toLowerCase());
      })
      .filter((product) => {
        // Filter by category
        if (selectedCategory === "All") return true;
        return product.category === selectedCategory;
      });
  }, [items, searchTerm, selectedCategory]);

  return (
    <main className='container mx-auto p-4'>
      <h1 className='text-3xl font-bold mb-6 text-center'>Our Products</h1>
      <div className='flex flex-col md:flex-row gap-4 mb-8'>
        <input
          type='text'
          placeholder='Search for products...'
          className='p-2 border rounded-md flex-grow'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className='p-2 border rounded-md bg-white'
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}>
          {categories.map((category) => (
            <option
              key={category}
              value={category}>
              {category === "All" ? "All Categories" : category}
            </option>
          ))}
        </select>
      </div>
      {status === "loading" && <div>Loading...</div>}
      {status === "failed" && <div>Error loading products.</div>}
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
        {filteredItems.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
          />
        ))}
      </div>
    </main>
  );
}
