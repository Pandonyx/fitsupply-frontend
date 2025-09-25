import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { AppDispatch, RootState } from "@/store";
import { logout } from "@/store/slices/authSlice";

export default function ProfilePage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    // This is a simple client-side protection.
    // We will implement more robust middleware-based protection later.
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
  };

  if (!user) {
    return <div className='p-6'>Loading or redirecting...</div>;
  }

  return (
    <main className='container mx-auto p-4'>
      <div className='max-w-2xl mx-auto bg-white shadow-md rounded-lg p-8'>
        <h1 className='text-3xl font-bold mb-4'>My Profile</h1>
        <div className='space-y-4'>
          <div>
            <h2 className='text-sm font-medium text-gray-500'>Full Name</h2>
            <p className='text-lg text-gray-900'>
              {user.first_name} {user.last_name}
            </p>
          </div>
          <div>
            <h2 className='text-sm font-medium text-gray-500'>Email Address</h2>
            <p className='text-lg text-gray-900'>{user.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className='mt-8 w-full bg-red-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-red-700 transition-colors'>
          Logout
        </button>
      </div>
    </main>
  );
}
