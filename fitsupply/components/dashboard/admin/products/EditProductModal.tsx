import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Image from "next/image";
import { RootState } from "@/store";
import { Product } from "@/interfaces";
import { EditProductModalProps } from "@/interfaces";

export default function EditProductModal({
  isOpen,
  onClose,
  onSuccess,
  product,
}: EditProductModalProps) {
  const { items: products } = useSelector((state: RootState) => state.products);

  // Separate image upload from text fields
  const [textFormData, setTextFormData] = useState({
    name: "",
    description: "",
    short_description: "",
    price: "",
    compare_price: "",
    stock_quantity: 0,
    low_stock_threshold: 10,
    sku: "",
    category_id: "",
    is_active: true,
    is_featured: false,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [currentImageUrl, setCurrentImageUrl] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Get unique categories from existing products
  const availableCategories = [
    ...new Map(
      products
        .map((p: Product) => p.category)
        .filter(Boolean)
        .filter(
          (cat): cat is { id: number; name: string; slug: string } =>
            typeof cat === "object" && cat !== null && "id" in cat
        )
        .map((cat) => [cat.id, { id: cat.id, name: cat.name }])
    ).values(),
  ];

  // Initialize form data when product changes
  useEffect(() => {
    if (product && isOpen) {
      setTextFormData({
        name: (product as any).name || "",
        description: (product as any).description || "",
        short_description: (product as any).short_description || "",
        price: (product as any).price?.toString() || "",
        compare_price: (product as any).compare_price?.toString() || "",
        stock_quantity: (product as any).stock_quantity || 0,
        low_stock_threshold: (product as any).low_stock_threshold || 10,
        sku: (product as any).sku || "",
        category_id: (product as any).category?.id?.toString() || "",
        is_active: (product as any).is_active ?? true,
        is_featured: (product as any).is_featured ?? false,
      });

      // Set current image
      if (product.image) {
        setCurrentImageUrl(product.image);
        setImagePreview(product.image);
      } else {
        setCurrentImageUrl("");
        setImagePreview("");
      }

      // Reset image upload
      setImageFile(null);
    }
  }, [product, isOpen]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file
      if (!file.type.startsWith("image/")) {
        alert("Please select a valid image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size must be less than 5MB");
        return;
      }

      setImageFile(file);
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview("");
    setCurrentImageUrl("");
  };

  // Update text fields only
  const updateTextFields = async () => {
    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"
        }/api/v1/products/${(product as any).slug}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(textFormData),
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Text update failed: ${errorData}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Text update error:", error);
      throw error;
    }
  };

  // Update image only (if changed)
  const updateImage = async () => {
    if (!imageFile) return null;

    try {
      const formData = new FormData();
      formData.append("image", imageFile);

      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"
        }/api/v1/products/${(product as any).slug}/`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            // No Content-Type for FormData
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Image update failed: ${errorData}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Image update error:", error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!(product as any)?.slug) {
      alert("No product selected for editing");
      return;
    }

    setIsUpdating(true);

    try {
      console.log("Starting update process...");

      // Step 1: Update text fields
      console.log("Updating text fields...");
      await updateTextFields();
      console.log("Text fields updated successfully");

      // Step 2: Update image if changed
      if (imageFile) {
        console.log("Updating image...");
        await updateImage();
        console.log("Image updated successfully");
      }

      alert("Product updated successfully!");
      onSuccess();
      handleClose();
    } catch (error: any) {
      console.error("Update failed:", error);
      alert(`Failed to update product: ${error.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleClose = () => {
    // Reset all form data
    setTextFormData({
      name: "",
      description: "",
      short_description: "",
      price: "",
      compare_price: "",
      stock_quantity: 0,
      low_stock_threshold: 10,
      sku: "",
      category_id: "",
      is_active: true,
      is_featured: false,
    });

    setImageFile(null);
    setImagePreview("");
    setCurrentImageUrl("");
    setIsUpdating(false);

    onClose();
  };

  if (!isOpen || !product) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto'>
        <h2 className='text-2xl font-bold mb-4'>Edit Product</h2>

        <form
          onSubmit={handleSubmit}
          className='space-y-4'>
          {/* Product Image Section */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Product Image
            </label>

            {/* Current/Preview Image */}
            {imagePreview && (
              <div className='mb-4'>
                <div className='relative w-32 h-32 border border-gray-300 rounded-lg overflow-hidden'>
                  <Image
                    src={imagePreview}
                    alt='Product preview'
                    fill
                    className='object-cover'
                  />
                </div>
                <button
                  type='button'
                  onClick={handleRemoveImage}
                  className='mt-2 text-sm text-red-600 hover:text-red-800'>
                  Remove Image
                </button>
              </div>
            )}

            {/* File Input */}
            <input
              type='file'
              accept='image/*'
              onChange={handleImageChange}
              className='block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100'
            />
            <p className='text-xs text-gray-500 mt-1'>
              Supported formats: JPG, PNG, GIF. Max size: 5MB
            </p>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Product Name *
              </label>
              <input
                type='text'
                required
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                value={textFormData.name}
                onChange={(e) =>
                  setTextFormData({ ...textFormData, name: e.target.value })
                }
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                SKU *
              </label>
              <input
                type='text'
                required
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                value={textFormData.sku}
                onChange={(e) =>
                  setTextFormData({ ...textFormData, sku: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Category *
            </label>
            <select
              required
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              value={textFormData.category_id}
              onChange={(e) =>
                setTextFormData({
                  ...textFormData,
                  category_id: e.target.value,
                })
              }>
              <option value=''>Select a category</option>
              {availableCategories.map((category) => (
                <option
                  key={category.id}
                  value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Description *
            </label>
            <textarea
              required
              rows={3}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              value={textFormData.description}
              onChange={(e) =>
                setTextFormData({
                  ...textFormData,
                  description: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Short Description
            </label>
            <input
              type='text'
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              value={textFormData.short_description}
              onChange={(e) =>
                setTextFormData({
                  ...textFormData,
                  short_description: e.target.value,
                })
              }
            />
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Price *
              </label>
              <input
                type='number'
                step='0.01'
                required
                min='0'
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                value={textFormData.price}
                onChange={(e) =>
                  setTextFormData({ ...textFormData, price: e.target.value })
                }
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Compare Price
              </label>
              <input
                type='number'
                step='0.01'
                min='0'
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                value={textFormData.compare_price}
                onChange={(e) =>
                  setTextFormData({
                    ...textFormData,
                    compare_price: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Stock Quantity *
              </label>
              <input
                type='number'
                required
                min='0'
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                value={textFormData.stock_quantity}
                onChange={(e) =>
                  setTextFormData({
                    ...textFormData,
                    stock_quantity: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Low Stock Threshold
              </label>
              <input
                type='number'
                min='0'
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                value={textFormData.low_stock_threshold}
                onChange={(e) =>
                  setTextFormData({
                    ...textFormData,
                    low_stock_threshold: parseInt(e.target.value) || 10,
                  })
                }
              />
            </div>
          </div>

          <div className='flex items-center space-x-4'>
            <label className='flex items-center'>
              <input
                type='checkbox'
                checked={textFormData.is_active}
                onChange={(e) =>
                  setTextFormData({
                    ...textFormData,
                    is_active: e.target.checked,
                  })
                }
                className='mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
              />
              <span className='text-sm font-medium text-gray-700'>Active</span>
            </label>
            <label className='flex items-center'>
              <input
                type='checkbox'
                checked={textFormData.is_featured}
                onChange={(e) =>
                  setTextFormData({
                    ...textFormData,
                    is_featured: e.target.checked,
                  })
                }
                className='mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
              />
              <span className='text-sm font-medium text-gray-700'>
                Featured
              </span>
            </label>
          </div>

          <div className='flex justify-end space-x-3 pt-4'>
            <button
              type='button'
              onClick={handleClose}
              disabled={isUpdating}
              className='px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50'>
              Cancel
            </button>
            <button
              type='submit'
              disabled={isUpdating}
              className='px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50'>
              {isUpdating ? "Updating..." : "Update Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
