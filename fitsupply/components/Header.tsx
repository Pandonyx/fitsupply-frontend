import { FaSearch } from "react-icons/fa";

const Header = () => {
  return (
    <header className='flex justify-between items-center p-4 bg-white shadow-md'>
      <div className='flex items-center space-x-2'>
        <h1 className='text-2xl font-bold text-gray-800'>FitSupply</h1>
      </div>
      <div className='flex items-center space-x-4'>
        <FaSearch className='text-gray-600 text-xl cursor-pointer' />
      </div>
    </header>
  );
};

export default Header;
