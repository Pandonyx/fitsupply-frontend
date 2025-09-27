// components/dashboard/admin/products/AddProductModal.tsx
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Product } from "@/interfaces";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddProductModal({
  isOpen,
  onClose,
  onSuccess,
}: AddProductModalProps) {
  const { items: products } = useSelector((state: RootState) => state.products);

  // Configure your backend URL here
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    short_description: "",
    price: "",
    compare_price: "",
    stock_quantity: 0,
    low_stock_threshold: 10,
    sku: "",
    category: "",
    slug: "",
    is_active: true,
    is_featured: false,
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [categories, setCategories] = useState<
    Array<{ id: string | number; name: string }>
  >([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  // Auto-generate slug from product name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  // Handle image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Fetch categories when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      console.log(
        "Fetching categories from:",
        `${API_BASE_URL}/api/v1/categories/`
      );

      // First try to fetch from dedicated categories endpoint
      const response = await fetch(`${API_BASE_URL}/api/v1/categories/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const categoriesData = await response.json();
        console.log("Categories fetched successfully:", categoriesData);
        setCategories(categoriesData.results || categoriesData);
      } else {
        console.log("Categories endpoint failed, using fallback method");
        // Fallback: extract unique categories from existing products
        const uniqueCategories = [
          ...new Map(
            products
              .map((p: Product) => p.category)
              .filter(Boolean)
              .map((cat) => [cat.id, { id: cat.id, name: cat.name }])
          ).values(),
        ];
        setCategories(uniqueCategories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      // Fallback: extract unique categories from existing products
      const uniqueCategories = [
        ...new Map(
          products
            .map((p: Product) => p.category)
            .filter(Boolean)
            .map((cat) => [cat.id, { id: cat.id, name: cat.name }])
        ).values(),
      ];
      setCategories(uniqueCategories);
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedImage) {
      alert("Please select a product image");
      return;
    }

    // Auto-generate slug if not provided
    const slug = formData.slug || generateSlug(formData.name);

    console.log("Form data being sent:", { ...formData, slug });

    try {
      console.log("Making API request to:", `${API_BASE_URL}/api/v1/products/`);

      // Create FormData for file upload
      const submitData = new FormData();

      // Add all form fields
      Object.entries({ ...formData, slug }).forEach(([key, value]) => {
        submitData.append(key, value.toString());
      });

      // Add image file
      submitData.append("image", selectedImage);

      const response = await fetch(`${API_BASE_URL}/api/v1/products/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          // Don't set Content-Type for FormData - let browser set it with boundary
        },
        body: submitData,
      });

      console.log("Response status:", response.status);

      if (response.ok) {
        const responseData = await response.json();
        console.log("Success response data:", responseData);
        alert("Product added successfully!");
        onSuccess();
        handleClose();
      } else {
        const errorData = await response.text();
        console.log("Error response:", errorData);
        alert(`Failed to add product: ${errorData}`);
      }
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Error adding product");
    }
  };

  const handleClose = () => {
    // Reset form data when closing
    setFormData({
      name: "",
      description: "",
      short_description: "",
      price: "",
      compare_price: "",
      stock_quantity: 0,
      low_stock_threshold: 10,
      sku: "",
      category: "",
      slug: "",
      is_active: true,
      is_featured: false,
    });
    setSelectedImage(null);
    setImagePreview(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto'>
        <h2 className='text-2xl font-bold mb-4'>Add New Product</h2>
        <form
          onSubmit={handleSubmit}
          className='space-y-4'>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Product Name *
              </label>
              <input
                type='text'
                required
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                value={formData.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setFormData({
                    ...formData,
                    name,
                    slug: generateSlug(name), // Auto-generate slug
                  });
                }}
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
                value={formData.sku}
                onChange={(e) =>
                  setFormData({ ...formData, sku: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Slug (URL-friendly name) *
            </label>
            <input
              type='text'
              required
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              value={formData.slug}
              onChange={(e) =>
                setFormData({ ...formData, slug: e.target.value })
              }
              placeholder='auto-generated-from-name'
            />
            <p className='text-xs text-gray-500 mt-1'>
              Auto-generated from product name. Edit if needed.
            </p>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Category *
            </label>
            <select
              required
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              disabled={loadingCategories}>
              <option value=''>
                {loadingCategories
                  ? "Loading categories..."
                  : "Select a category"}
              </option>
              {categories.map((category) => (
                <option
                  key={category.id}
                  value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {categories.length === 0 && !loadingCategories && (
              <p className='text-sm text-red-600 mt-1'>
                No categories available. Please create categories first or check
                your backend connection.
              </p>
            )}
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Product Image *
            </label>
            <input
              type='file'
              accept='image/*'
              required
              onChange={handleImageChange}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            />
            {imagePreview && (
              <div className='mt-2'>
                <img
                  src={imagePreview}
                  alt='Preview'
                  className='w-32 h-32 object-cover rounded-md border'
                />
              </div>
            )}
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Description *
            </label>
            <textarea
              required
              rows={3}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
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
              value={formData.short_description}
              onChange={(e) =>
                setFormData({ ...formData, short_description: e.target.value })
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
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
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
                value={formData.compare_price}
                onChange={(e) =>
                  setFormData({ ...formData, compare_price: e.target.value })
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
                value={formData.stock_quantity}
                onChange={(e) =>
                  setFormData({
                    ...formData,
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
                value={formData.low_stock_threshold}
                onChange={(e) =>
                  setFormData({
                    ...formData,
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
                checked={formData.is_active}
                onChange={(e) =>
                  setFormData({ ...formData, is_active: e.target.checked })
                }
                className='mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
              />
              <span className='text-sm font-medium text-gray-700'>Active</span>
            </label>
            <label className='flex items-center'>
              <input
                type='checkbox'
                checked={formData.is_featured}
                onChange={(e) =>
                  setFormData({ ...formData, is_featured: e.target.checked })
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
              className='px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors'>
              Cancel
            </button>
            <button
              type='submit'
              className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors'>
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
