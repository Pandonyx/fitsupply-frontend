import { useState } from "react";
import Image from "next/image";

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductGallery({
  images,
  productName,
}: ProductGalleryProps) {
  const [mainImage, setMainImage] = useState(images[0]);

  return (
    <div className='flex flex-col items-center'>
      <div className='w-full h-96 relative mb-4'>
        <Image
          src={mainImage}
          alt={productName}
          fill
          style={{ objectFit: "contain" }}
          className='rounded-lg shadow-md'
        />
      </div>
      <div className='flex space-x-2 overflow-x-auto'>
        {images.map((image, index) => (
          <div
            key={index}
            className={`relative w-24 h-24 cursor-pointer border-2 ${
              image === mainImage ? "border-blue-500" : "border-transparent"
            } rounded-md overflow-hidden`}
            onClick={() => setMainImage(image)}>
            <Image
              src={image}
              alt={`${productName} thumbnail ${index + 1}`}
              fill
              style={{ objectFit: "cover" }}
              className='rounded-md'
            />
          </div>
        ))}
      </div>
    </div>
  );
}
