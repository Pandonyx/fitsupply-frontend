import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { logout } from "@/store/slices/authSlice";
import { useRouter } from "next/router";

const Header = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { items: cartItems } = useSelector((state: RootState) => state.cart);
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );

  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
  };

  return (
    <header className='bg-white shadow-md'>
      <nav className='container mx-auto px-6 py-3 flex justify-between items-center'>
        <Link
          href='/'
          className='text-2xl font-bold text-gray-800 hover:text-gray-600'>
          FitSupply
        </Link>
        <div className='flex items-center'>
          <Link
            href='/products'
            className='text-gray-800 hover:text-gray-600 mx-4'>
            Products
          </Link>
          <Link
            href='/cart'
            className='relative'>
            <svg
              className='w-6 h-6 text-gray-800'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z'
              />
            </svg>
            {totalItems > 0 && (
              <span className='absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center'>
                {totalItems}
              </span>
            )}
          </Link>
          {isAuthenticated ? (
            <>
              <Link
                href='/profile'
                className='text-gray-800 hover:text-gray-600 mx-4'>
                {user?.username || "Profile"}
              </Link>
              <button
                onClick={handleLogout}
                className='text-gray-800 hover:text-gray-600 mx-4'>
                Logout
              </button>
            </>
          ) : (
            <Link
              href='/login'
              className='text-gray-800 hover:text-gray-600 mx-4'>
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
