// components/ProductImage.tsx
import Image from "next/image";
import { useState } from "react";

interface ProductImageProps {
  src: string;
  alt: string;
  productId?: number;
  className?: string;
  width?: number;
  height?: number;
}

const ProductImage = ({
  src,
  alt,
  productId,
  className,
  width = 200,
  height = 200,
}: ProductImageProps) => {
  const [imgSrc, setImgSrc] = useState(src);

  const fallbackImages = [
    "/images/products/bcaa1.jpg",
    "/images/products/carnitine.webp",
    "/images/products/casein.jpg",
    "/images/products/glutamine.webp",
    "/images/products/mass1.png",
    "/images/products/preworkout1.png",
    "/images/products/wheyisolate.jpg",
    "/images/products/plantbasedwhey.jpg",
    "/images/products/dextrose.jpg",
    "/images/products/bcaa2.jpg",
  ];

  const getFallbackImage = () => {
    const index = productId ? productId % fallbackImages.length : 0;
    return fallbackImages[index];
  };

  const handleError = () => {
    setImgSrc(getFallbackImage());
  };

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={handleError}
    />
  );
};

export default ProductImage;
