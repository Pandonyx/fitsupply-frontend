import { useState } from "react";
import ProductImage from "./ProductImage";

interface ProductGalleryProps {
  images: string[];
  productName: string;
  productId?: number;
}

export default function ProductGallery({
  images,
  productName,
  productId,
}: ProductGalleryProps) {
  const [mainImage, setMainImage] = useState(
    images[0] || "/images/products/placeholder.jpg"
  );

  return (
    <div className='flex flex-col items-center'>
      <div className='w-full h-96 relative mb-4'>
        <ProductImage
          src={mainImage}
          alt={productName}
          productId={productId}
          fill
          style={{ objectFit: "contain" }}
          className='rounded-lg shadow-md'
        />
      </div>
      <div className='flex space-x-2 overflow-x-auto p-2'>
        {images.map((image, index) => (
          <div
            key={index}
            className={`relative w-24 h-24 cursor-pointer border-2 ${
              image === mainImage ? "border-blue-500" : "border-transparent"
            } rounded-md overflow-hidden flex-shrink-0`}
            onClick={() => setMainImage(image)}>
            <ProductImage
              src={image}
              alt={`${productName} thumbnail ${index + 1}`}
              productId={productId}
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
