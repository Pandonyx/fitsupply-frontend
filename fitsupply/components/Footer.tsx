import Link from "next/link";

const Footer = () => {
  return (
    <footer className='bg-gray-800 text-white p-6 mt-10'>
      <div className='container mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 text-center md:text-left'>
        <div>
          <h3 className='font-bold text-lg'>FitSupply</h3>
          <p className='text-sm text-gray-400'>
            Your one-stop shop for premium fitness supplements.
          </p>
        </div>
        <div>
          <h3 className='font-bold text-lg'>Quick Links</h3>
          <ul className='text-sm'>
            <li>
              <Link
                href='/products'
                className='hover:underline'>
                Products
              </Link>
            </li>
            <li>
              <Link
                href='/cart'
                className='hover:underline'>
                Cart
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className='text-center text-gray-500 text-sm mt-6 border-t border-gray-700 pt-4'>
        © {new Date().getFullYear()} FitSupply. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
