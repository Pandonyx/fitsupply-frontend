import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import api from "@/lib/apiClient";
import Image from "next/image";
import { Product } from "@/interfaces";
import ProductGallery from "@/components/ProductGallery";
import { AppDispatch } from "@/store";
import { addToCart } from "@/store/slices/cartSlice";

export default function ProductDetail() {
  const { query } = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const slug = query.slug as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    if (slug) {
      const fetchProduct = async () => {
        try {
          setLoading(true);
          const response = await api.get<Product[]>(`/products?slug=${slug}`);
          if (response.data && response.data.length > 0) {
            setProduct(response.data[0]);
          }
        } catch (err) {
          setError(err);
        } finally {
          setLoading(false);
        }
      };

      fetchProduct();
    }
  }, [slug]);

  if (loading) return <div className='p-6'>Loading...</div>;
  if (error) return <div>Error loading product</div>;
  if (!product) return <div>Product not found.</div>;

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.images?.[0],
        qty: 1, // For now, we add 1. We can add a quantity selector later.
      })
    );
    setAddedToCart(true);
    setTimeout(() => {
      setAddedToCart(false);
    }, 2000); // Reset the message after 2 seconds
  };

  return (
    <main className='container mx-auto p-4'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div>
          <ProductGallery
            images={product.images || []}
            productName={product.name}
          />
        </div>
        <div>
          <h1 className='text-2xl font-bold'>{product.name}</h1>
          <p className='text-xl font-semibold mt-2'>
            ${parseFloat(String(product.price)).toFixed(2)}
          </p>
          <p className='mt-4 text-gray-700'>{product.description}</p>
          <div className='mt-6'>
            <button
              onClick={handleAddToCart}
              className='bg-black text-white px-6 py-3 rounded font-semibold hover:bg-gray-800 transition-colors'>
              {addedToCart ? "Added!" : "Add to Cart"}
            </button>
            {addedToCart && (
              <p className='text-green-600 mt-2'>
                Successfully added to your cart!
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
