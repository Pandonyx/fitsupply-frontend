import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "@/components/ProductCard";
import { fetchProducts } from "@/store/slices/productSlice";
import type { RootState, AppDispatch } from "@/store";

export default function ProductsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, status } = useSelector((s: RootState) => s.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <main className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4'>All Products</h1>
      {status === "loading" && <div>Loading...</div>}
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
        {items.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
          />
        ))}
      </div>
    </main>
  );
}
