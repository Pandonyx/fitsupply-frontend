import AdminLayout from "@/components/AdminLayout";

const AdminOrdersPage = () => {
  return (
    <AdminLayout>
      <h1 className='text-3xl font-bold'>View Orders</h1>
      <p className='mt-4'>Here you can view and manage customer orders.</p>
      {/* Orders table will go here */}
    </AdminLayout>
  );
};

export default AdminOrdersPage;
