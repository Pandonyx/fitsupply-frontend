// pages/admin/products.tsx
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdminLayout from "@/components/AdminLayout";
import { AppDispatch, RootState } from "@/store";
import { fetchProducts } from "@/store/slices/productSlice";
import ProductsHeader from "@/components/dashboard/admin/products/ProductsHeader";
import ProductsStats from "@/components/dashboard/admin/products/ProductsStats";
import ProductsFilters from "@/components/dashboard/admin/products/ProductsFilters";
import ProductsTable from "@/components/dashboard/admin/products/ProductsTable";
import AddProductModal from "@/components/dashboard/admin/products/AddProductModal";
import EditProductModal from "@/components/dashboard/admin/products/EditProductModal";
import { Product } from "@/interfaces";

export default function AdminProductsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { items: products, status } = useSelector(
    (state: RootState) => state.products
  );

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Filter products based on search and filters
  const filteredProducts = products.filter((product: Product) => {
    const matchesSearch =
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      filterCategory === "All" || product.category?.name === filterCategory;

    const matchesStatus =
      filterStatus === "All" ||
      (filterStatus === "Active" && product.is_active) ||
      (filterStatus === "Inactive" && !product.is_active) ||
      (filterStatus === "Featured" && product.is_featured) ||
      (filterStatus === "Low Stock" &&
        product.stock_quantity <= product.low_stock_threshold);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Get unique categories
  const categories = [
    "All",
    ...new Set(products.map((p: Product) => p.category?.name).filter(Boolean)),
  ];

  const handleQuickEdit = async (
    productId: number,
    field: string,
    value: any
  ) => {
    try {
      const response = await fetch(`/api/v1/products/${productId}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ [field]: value }),
      });

      if (response.ok) {
        dispatch(fetchProducts());
      } else {
        alert("Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Error updating product");
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    if (
      !confirm(
        "Are you sure you want to delete this product? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/v1/products/${productId}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        dispatch(fetchProducts());
        alert("Product deleted successfully");
      } else {
        alert("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Error deleting product");
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterCategory("All");
    setFilterStatus("All");
  };

  return (
    <AdminLayout>
      <div className='space-y-6'>
        <ProductsHeader onAddProduct={() => setShowAddModal(true)} />

        <ProductsStats products={products} />

        <ProductsFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategory}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          categories={categories}
          onClearFilters={clearFilters}
        />

        <ProductsTable
          products={filteredProducts}
          onQuickEdit={handleQuickEdit}
          onEdit={setEditingProduct}
          onDelete={handleDeleteProduct}
        />

        {showAddModal && (
          <AddProductModal
            isOpen={showAddModal}
            onClose={() => setShowAddModal(false)}
            onSuccess={() => {
              setShowAddModal(false);
              dispatch(fetchProducts());
            }}
          />
        )}

        {editingProduct && (
          <EditProductModal
            product={editingProduct}
            isOpen={!!editingProduct}
            onClose={() => setEditingProduct(null)}
            onSuccess={() => {
              setEditingProduct(null);
              dispatch(fetchProducts());
            }}
          />
        )}
      </div>
    </AdminLayout>
  );
}
