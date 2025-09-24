import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { addToCart } from "@/store/slices/cartSlice";

export default function ProductCard({ product }: { product: Product }) {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div className='border rounded p-3 flex flex-col'>
      <Link
        href={`/products/${product.slug}`}
        className='block'>
        <div className='w-full h-48 relative'>
          <Image
            src={product.images?.[0] || "/images/placeholder.png"}
            alt={product.name}
            fill
            style={{ objectFit: "contain" }}
          />
        </div>
        <h3 className='font-semibold mt-2'>{product.name}</h3>
        <p className='text-sm text-gray-600'>{product.shortDescription}</p>
      </Link>
      <div className='mt-auto flex items-center justify-between'>
        <div className='text-lg font-bold'>${product.price.toFixed(2)}</div>
        <button
          onClick={() =>
            dispatch(
              addToCart({
                productId: product.id,
                name: product.name,
                price: product.price,
                image: product.images?.[0],
                qty: 1,
              })
            )
          }
          className='bg-black text-white px-3 py-1 rounded'>
          Add
        </button>
      </div>
    </div>
  );
}
