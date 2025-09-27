import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Product } from "@/interfaces";

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  product: Product | null;
}

export default function EditProductModal({
  isOpen,
  onClose,
  onSuccess,
  product,
}: EditProductModalProps) {
  const { items: products } = useSelector((state: RootState) => state.products);

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
    is_active: true,
    is_featured: false,
  });

  // Get unique categories from existing products
  const availableCategories = [
    ...new Map(
      products
        .map((p: Product) => p.category)
        .filter(Boolean)
        .map((cat) => [cat.id, { id: cat.id, name: cat.name }])
    ).values(),
  ];

  // Populate form with product data when modal opens
  useEffect(() => {
    if (product && isOpen) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        short_description: product.short_description || "",
        price: product.price?.toString() || "",
        compare_price: product.compare_price?.toString() || "",
        stock_quantity: product.stock_quantity || 0,
        low_stock_threshold: product.low_stock_threshold || 10,
        sku: product.sku || "",
        category: product.category?.id?.toString() || "",
        is_active: product.is_active ?? true,
        is_featured: product.is_featured ?? false,
      });
    }
  }, [product, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!product?.id) {
      alert("No product selected for editing");
      return;
    }

    console.log("Form data being sent:", formData);

    try {
      console.log("Making API request to update product:", product.id);

      const response = await fetch(`/api/v1/products/${product.id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      console.log("Response status:", response.status);

      if (response.ok) {
        const responseData = await response.json();
        console.log("Success response data:", responseData);
        alert("Product updated successfully!");
        onSuccess();
      } else {
        const errorData = await response.text();
        console.log("Error response:", errorData);
        alert(`Failed to update product: ${errorData}`);
      }
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Error updating product");
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
      is_active: true,
      is_featured: false,
    });
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
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
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
                value={formData.sku}
                onChange={(e) =>
                  setFormData({ ...formData, sku: e.target.value })
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
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
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
              className='px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors'>
              Update Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
