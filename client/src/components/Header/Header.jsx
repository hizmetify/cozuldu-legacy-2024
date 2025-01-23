import { Link } from 'react-router-dom';
import { MdDashboard } from 'react-icons/md';
import { FaBars } from 'react-icons/fa6';
import CategoryDropdown from './CategoryDropdown';

const Header = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-gray-800">Logo</h1>
            </div>
            <div className="hidden md:block ml-10">
              <CategoryDropdown />
            </div>
          </div>
          <nav className="hidden md:block">
            <ul className="flex items-center space-x-4">
              <li>
                <Link
                  to="/login"
                  className="text-blue-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out"
                >
                  Giriş Yap
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out"
                >
                  Hizmet Ver
                </Link>
              </li>
            </ul>
          </nav>
          <div className="md:hidden">
            <button className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:gray-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500">
              <span className="sr-only">Open main menu</span>
              <FaBars />
            </button>
          </div>
        </div>
      </div>
      <div className="md:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <button className="flex items-center w-full px-3 py-2 text-base font-medium text-blue-700 rounded-md hover:text-blue-600 hover:bg-blue-100">
            <span>Kategoriler</span>
            <MdDashboard className="ml-2 text-blue-600 text-lg" />
          </button>
          <Link
            to="/login"
            className="block px-3 py-2 rounded-md text-base font-medium text-blue-700 hover:text-blue-600 hover:bg-blue-100"
          >
            Giriş Yap
          </Link>
          <Link
            to="/register"
            className="block px-3 py-2 rounded-md text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Hizmet Ver
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
