import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import Link from "next/link";
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

  // Helper function to get category name consistently
  const getCategoryName = (product: any): string => {
    if (typeof product.category === "object" && product.category?.name) {
      return product.category.name;
    }
    if (typeof product.category === "string") {
      return product.category;
    }
    return "Uncategorized";
  };

  // Helper function to get category link
  const getCategoryLink = (product: any): string => {
    const categoryName = getCategoryName(product);
    return `/products/category/${encodeURIComponent(categoryName)}`;
  };

  if (status === "loading" || router.isFallback)
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600'></div>
      </div>
    );

  if (status === "failed")
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-red-600 mb-4'>
            Error Loading Product
          </h1>
          <p className='text-gray-600 mb-4'>{error}</p>
          <button
            onClick={() => router.back()}
            className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700'>
            Go Back
          </button>
        </div>
      </div>
    );

  if (!product)
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-gray-800 mb-4'>
            Product Not Found
          </h1>
          <p className='text-gray-600 mb-4'>
            The product you're looking for doesn't exist.
          </p>
          <Link
            href='/products'
            className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 inline-block'>
            Browse All Products
          </Link>
        </div>
      </div>
    );

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

  const categoryName = getCategoryName(product);
  const categoryLink = getCategoryLink(product);

  return (
    <main className='min-h-screen bg-gray-50'>
      {/* Breadcrumb */}
      <div className='bg-white border-b'>
        <div className='container mx-auto px-6 py-4'>
          <nav className='flex items-center space-x-2 text-sm text-gray-600'>
            <Link
              href='/'
              className='hover:text-blue-600'>
              Home
            </Link>
            <span>/</span>
            <Link
              href='/products'
              className='hover:text-blue-600'>
              Products
            </Link>
            <span>/</span>
            <Link
              href={categoryLink}
              className='hover:text-blue-600'>
              {categoryName}
            </Link>
            <span>/</span>
            <span className='text-gray-800'>{product.name}</span>
          </nav>
        </div>
      </div>

      <div className='container mx-auto px-6 py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
          {/* Product Images */}
          <div className='space-y-4'>
            <div className='relative w-full h-96 lg:h-[500px] bg-white rounded-lg shadow-sm overflow-hidden'>
              <Image
                src={imageUrl}
                alt={product.name}
                fill
                style={{ objectFit: "contain" }}
                className='p-4'
              />
            </div>

            {/* Additional product images could go here */}
            {product.images && product.images.length > 1 && (
              <div className='grid grid-cols-4 gap-2'>
                {product.images.slice(1, 5).map((image, index) => (
                  <div
                    key={index}
                    className='relative h-20 bg-white rounded border'>
                    <Image
                      src={new URL(image, API_URL!).href}
                      alt={`${product.name} ${index + 2}`}
                      fill
                      style={{ objectFit: "contain" }}
                      className='p-1'
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className='space-y-6'>
            {/* Category Badge */}
            <div>
              <Link
                href={categoryLink}
                className='inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full hover:bg-blue-200 transition-colors'>
                {categoryName}
              </Link>
            </div>

            {/* Product Title */}
            <div>
              <h1 className='text-3xl lg:text-4xl font-bold text-gray-900 mb-2'>
                {product.name}
              </h1>
              {product.short_description && (
                <p className='text-lg text-gray-600'>
                  {product.short_description}
                </p>
              )}
            </div>

            {/* Pricing */}
            <div className='flex items-center space-x-4'>
              <span className='text-3xl font-bold text-gray-900'>
                ${Number(product.price).toFixed(2)}
              </span>
              {product.compare_price &&
                Number(product.compare_price) > Number(product.price) && (
                  <span className='text-xl text-gray-500 line-through'>
                    ${Number(product.compare_price).toFixed(2)}
                  </span>
                )}
            </div>

            {/* Stock Status */}
            <div className='flex items-center space-x-2'>
              {product.stock_quantity > 0 ? (
                <>
                  <div className='w-3 h-3 bg-green-500 rounded-full'></div>
                  <span className='text-green-600 font-medium'>In Stock</span>
                  {product.stock_quantity <=
                    (product.low_stock_threshold || 10) && (
                    <span className='text-orange-600 text-sm'>
                      (Only {product.stock_quantity} left!)
                    </span>
                  )}
                </>
              ) : (
                <>
                  <div className='w-3 h-3 bg-red-500 rounded-full'></div>
                  <span className='text-red-600 font-medium'>Out of Stock</span>
                </>
              )}
            </div>

            {/* Add to Cart */}
            <div className='space-y-4'>
              <button
                onClick={handleAddToCart}
                disabled={product.stock_quantity <= 0 || addedToCart}
                className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-colors ${
                  product.stock_quantity <= 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : addedToCart
                    ? "bg-green-600 text-white"
                    : "bg-black text-white hover:bg-gray-800"
                }`}>
                {product.stock_quantity <= 0
                  ? "Out of Stock"
                  : addedToCart
                  ? "✓ Added to Cart!"
                  : "Add to Cart"}
              </button>

              {addedToCart && (
                <p className='text-green-600 text-center font-medium'>
                  Successfully added to your cart!
                </p>
              )}
            </div>

            {/* Product Details */}
            <div className='space-y-4 pt-6 border-t border-gray-200'>
              <h3 className='text-lg font-semibold text-gray-900'>
                Product Details
              </h3>

              {product.sku && (
                <div className='flex justify-between'>
                  <span className='text-gray-600'>SKU:</span>
                  <span className='font-medium'>{product.sku}</span>
                </div>
              )}

              <div className='flex justify-between'>
                <span className='text-gray-600'>Category:</span>
                <Link
                  href={categoryLink}
                  className='font-medium text-blue-600 hover:text-blue-800'>
                  {categoryName}
                </Link>
              </div>

              {product.is_featured && (
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Featured Product:</span>
                  <span className='font-medium text-yellow-600'>⭐ Yes</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product Description */}
        {product.description && (
          <div className='mt-12 bg-white rounded-lg shadow-sm p-8'>
            <h2 className='text-2xl font-bold text-gray-900 mb-6'>
              Description
            </h2>
            <div className='prose max-w-none text-gray-700'>
              <p className='whitespace-pre-wrap'>{product.description}</p>
            </div>
          </div>
        )}

        {/* Related Products Section */}
        <div className='mt-12'>
          <div className='flex items-center justify-between mb-6'>
            <h2 className='text-2xl font-bold text-gray-900'>
              Related Products
            </h2>
            <Link
              href={categoryLink}
              className='text-blue-600 hover:text-blue-800 font-medium'>
              View all in {categoryName} →
            </Link>
          </div>
          {/* You can add a RelatedProducts component here */}
        </div>
      </div>
    </main>
  );
}
