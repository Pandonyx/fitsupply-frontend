import Link from "next/link";
import AdminRoute from "./AdminRoute";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AdminRoute>
      <div className='flex min-h-screen'>
        <aside className='w-64 bg-gray-800 text-white p-4'>
          <h1 className='text-2xl font-bold mb-8'>Admin Panel</h1>
          <nav>
            <ul>
              <li className='mb-4'>
                <Link
                  href='/admin/dashboard'
                  className='hover:text-gray-300'>
                  Dashboard
                </Link>
              </li>
              <li className='mb-4'>
                <Link
                  href='/admin/products'
                  className='hover:text-gray-300'>
                  Products
                </Link>
              </li>
              <li>
                <Link
                  href='/admin/orders'
                  className='hover:text-gray-300'>
                  Orders
                </Link>
              </li>
            </ul>
          </nav>
        </aside>
        <main className='flex-grow p-6 bg-gray-100'>{children}</main>
      </div>
    </AdminRoute>
  );
};

export default AdminLayout;
