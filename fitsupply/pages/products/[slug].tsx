import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import { AppDispatch, RootState } from "@/store";
import { addToCart } from "@/store/slices/cartSlice";
import { fetchProductBySlug } from "@/store/slices/productSlice";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ProductDetail() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { slug } = router.query;
  const [addedToCart, setAddedToCart] = useState(false);

  const {
    selectedItem: product,
    status,
    error,
  } = useSelector((s: RootState) => s.products);

  useEffect(() => {
    if (slug && typeof slug === "string") {
      dispatch(fetchProductBySlug(slug));
    }
  }, [dispatch, slug]);

  if (status === "loading" || router.isFallback)
    return <div className='p-6'>Loading...</div>;
  if (status === "failed") return <div>Error: {error}</div>;
  if (!product) return <div>Product not found.</div>;

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        productId: String(product.id),
        name: product.name,
        price: product.price,
        image: product.images?.[0],
        qty: 1,
      })
    );
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const imageUrl = product.images?.[0]
    ? new URL(product.images[0], API_URL!).href
    : "/placeholder.png";

  return (
    <main className='container mx-auto p-4'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div>
          <div className='relative w-full h-96'>
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
        </div>
        <div>
          <h1 className='text-2xl font-bold'>{product.name}</h1>
          <p className='text-xl font-semibold mt-2'>
            ${Number(product.price).toFixed(2)}
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
