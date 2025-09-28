import Link from "next/link";
import ProductImage from "./ProductImage";
import { Product } from "@/interfaces";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const imageUrl = (product as any).image || "/images/products/placeholder.jpg";

  return (
    <div className='bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full group'>
      <Link href={`/products/${(product as any).slug}`}>
        {/* Fixed height container with proper centering */}
        <div className='relative w-full h-56 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4'>
          <div className='relative w-full h-full'>
            <ProductImage
              src={imageUrl}
              alt={(product as any).name}
              productId={(product as any).id}
              fill
              style={{ objectFit: "contain" }}
              className='group-hover:scale-105 transition-transform duration-300'
            />
          </div>
        </div>

        <div className='p-4 flex-grow flex flex-col justify-between'>
          <div>
            <h2 className='text-lg font-bold text-gray-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors leading-tight'>
              {(product as any).name}
            </h2>
            <p className='text-sm text-gray-500 mb-3 uppercase tracking-wide font-medium'>
              {typeof (product as any).category === "object"
                ? (product as any).category?.name
                : (product as any).category || "Supplements"}
            </p>
          </div>
          <div className='flex items-center justify-between mt-auto'>
            <p className='text-2xl font-bold text-blue-600'>
              ${Number((product as any).price).toFixed(2)}
            </p>
            <span className='bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium group-hover:bg-blue-700 transition-colors'>
              View Details
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
