import AdminLayout from "@/components/AdminLayout";

const AdminProductsPage = () => {
  return (
    <AdminLayout>
      <h1 className='text-3xl font-bold'>Manage Products</h1>
      <p className='mt-4'>Here you can add, edit, and delete products.</p>
      {/* Product table and forms will go here */}
    </AdminLayout>
  );
};

export default AdminProductsPage;
