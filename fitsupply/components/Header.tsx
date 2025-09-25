import Link from "next/link";
import { FaSearch, FaShoppingCart, FaUser } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

const Header = () => {
  const { items: cartItems } = useSelector((s: RootState) => s.cart);
  const { isAuthenticated } = useSelector((s: RootState) => s.auth);
  const itemCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <header className='flex justify-between items-center p-4 bg-white shadow-md'>
      {/* Left Side: Logo and Nav */}
      <div className='flex items-center space-x-8'>
        <Link
          href='/'
          className='text-2xl font-bold text-gray-800'>
          FitSupply
        </Link>
        <nav className='hidden md:flex items-center space-x-4'>
          <Link
            href='/'
            className='text-gray-600 hover:text-gray-900'>
            Home
          </Link>
          <Link
            href='/products'
            className='text-gray-600 hover:text-gray-900'>
            All Products
          </Link>
        </nav>
      </div>

      {/* Right Side: Search and Cart */}
      <div className='flex items-center space-x-6'>
        <FaSearch className='text-gray-600 text-xl cursor-pointer' />
        {isAuthenticated ? (
          <Link
            href='/profile'
            className='text-gray-600 hover:text-gray-900'>
            <FaUser className='text-xl' />
          </Link>
        ) : (
          <Link
            href='/login'
            className='text-gray-600 hover:text-gray-900 font-semibold'>
            Login
          </Link>
        )}
        <Link
          href='/cart'
          className='relative'>
          <FaShoppingCart className='text-gray-600 text-xl' />
          {itemCount > 0 && (
            <span className='absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center'>
              {itemCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
};

export default Header;
