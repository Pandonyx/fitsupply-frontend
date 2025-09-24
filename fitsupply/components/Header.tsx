import Link from "next/link";
import { FaSearch, FaShoppingCart } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

const Header = () => {
  const { items } = useSelector((s: RootState) => s.cart);
  const itemCount = items.reduce((acc, item) => acc + item.qty, 0);

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
