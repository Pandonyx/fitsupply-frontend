import Link from "next/link";
import Image from "next/image";
import { Product } from "@/interfaces";

interface ProductCardProps {
  product: Product;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const imageUrl = product.images?.[0]
    ? new URL(product.images[0], API_URL).href
    : "/placeholder.png";

  return (
    <div className='border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300'>
      <Link href={`/products/${product.slug}`}>
        <div className='relative w-full h-64'>
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className='p-4'>
          <h2 className='text-lg font-semibold truncate'>{product.name}</h2>
          <p className='text-gray-500'>{product.category}</p>
          <p className='text-xl font-bold mt-2'>
            ${Number(product.price).toFixed(2)}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
