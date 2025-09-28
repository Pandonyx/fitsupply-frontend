import Link from "next/link";
import ProductImage from "./ProductImage";
import { Product } from "@/interfaces";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const imageUrl = (product as any).image || "/images/products/placeholder.jpg";

  return (
    <div className='bg-white border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full'>
      <Link href={`/products/${(product as any).slug}`}>
        {/* Fixed height container for consistent image sizing */}
        <div className='relative w-full h-48 bg-gray-100'>
          <ProductImage
            src={imageUrl}
            alt={(product as any).name}
            productId={(product as any).id}
            fill
            style={{ objectFit: "contain" }}
            className='p-2'
          />
        </div>

        {/* Content section with flex-grow to fill remaining space */}
        <div className='p-4 flex-grow flex flex-col justify-between'>
          <div>
            <h2 className='text-lg font-semibold line-clamp-2 mb-2'>
              {(product as any).name}
            </h2>
            <p className='text-gray-500 text-sm mb-2'>
              {typeof (product as any).category === "object"
                ? (product as any).category?.name
                : (product as any).category || "Uncategorized"}
            </p>
          </div>
          <p className='text-xl font-bold text-blue-600 mt-auto'>
            ${Number((product as any).price).toFixed(2)}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
