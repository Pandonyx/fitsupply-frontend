import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import ProductCard from "@/components/ProductCard";
import { fetchProducts } from "@/store/slices/productSlice";
import type { RootState, AppDispatch } from "@/store";

export default function CategoryPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { items, status } = useSelector((s: RootState) => s.products);

  // Get the category name from the URL query parameters
  const { category } = router.query;

  useEffect(() => {
    // Fetch products if they haven't been loaded yet
    if (status === "idle") {
      dispatch(fetchProducts());
    }
  }, [dispatch, status]);

  // Filter products based on the current category.
  // useMemo ensures this only re-runs when items or category changes.
  const filteredItems = useMemo(() => {
    if (!items || !category) return [];
    return items.filter((product) => product.category === category);
  }, [items, category]);

  if (router.isFallback || status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <main className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4 capitalize'>{category}</h1>
      {status === "failed" && <div>Error loading products.</div>}
      {filteredItems.length > 0 ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
          {filteredItems.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
            />
          ))}
        </div>
      ) : (
        <p>No products found in this category.</p>
      )}
    </main>
  );
}
