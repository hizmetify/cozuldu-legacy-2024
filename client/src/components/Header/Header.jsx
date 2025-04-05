import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import CategoryDropdown from './CategoryDropdown';
import MobileCategoryAccordion from './MobileCategoryAccordion';
import {
  IoCloseOutline,
  IoMenuOutline,
  IoSearchOutline,
} from 'react-icons/io5';
import { useSelector, useDispatch } from 'react-redux';
import { selectSidebar } from '../../features/sidebar/sidebarSlice';
import { toggleSidebar } from '../../features/sidebar/sidebarSlice';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const isOpen = useSelector(selectSidebar);
  const dispatch = useDispatch();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header
      className={`bg-white ${
        scrolled ? 'shadow-md' : 'shadow-sm'
      } sticky top-0 z-50 transition-shadow duration-300`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link
                to={'/home'}
                className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 transition-all duration-300"
              >
                Çözüldü
              </Link>
            </div>
            <div className="hidden md:block ml-10">
              <CategoryDropdown />
            </div>
          </div>
  {/*           <div className="hidden md:flex items-center max-w-md w-full mx-4 relative">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Hizmet ara..."
                  className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200 outline-none text-sm"
                />
                <IoSearchOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
              </div>
            </div> */}
          <nav className="hidden md:block">
            <ul className="flex items-center space-x-1">
              <li>
                <Link
                  to={'/contact'}
                  className={`relative px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out hover:text-blue-700 ${
                    isActive('/contact')
                      ? 'text-blue-700 font-semibold'
                      : 'text-gray-700'
                  }`}
                >
                  Bize Ulaşın
                  {isActive('/contact') && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className={`relative px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out hover:text-blue-700 ${
                    isActive('/login')
                      ? 'text-blue-700 font-semibold'
                      : 'text-gray-700'
                  }`}
                >
                  Giriş Yap
                  {isActive('/login') && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800 px-5 py-2.5 rounded-lg text-sm font-medium transition duration-300 ease-in-out shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                >
                  Hizmet Ver
                </Link>
              </li>
            </ul>
          </nav>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => dispatch(toggleSidebar())}
              className="inline-flex items-center justify-center p-2 rounded-full text-gray-700 hover:text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              aria-expanded={isOpen}
            >
              <span className="sr-only">
                {isOpen ? 'Close main menu' : 'Open main menu'}
              </span>
              <motion.div
                initial={false}
                animate={{ rotate: isOpen ? 90 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isOpen ? (
                  <IoCloseOutline className="text-2xl" />
                ) : (
                  <IoMenuOutline className="text-2xl" />
                )}
              </motion.div>
            </button>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="md:hidden bg-white overflow-x-hidden fixed top-20 left-0 right-0 z-50 max-h-[calc(100vh-5rem)] overflow-y-auto"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
{/*             <div className="px-4 pt-4 pb-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Hizmet ara..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200 outline-none"
                />
                <IoSearchOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
              </div>
            </div> */}

            <div className="px-4 pt-2 pb-5 space-y-3">
              <MobileCategoryAccordion />

              <div className="border-t border-gray-100 my-3"></div>

              <Link
                to="/contact"
                className="flex items-center px-3 py-2.5 rounded-lg text-base font-medium text-gray-700 hover:text-blue-700 hover:bg-blue-50 transition-all duration-200"
                onClick={() => dispatch(toggleSidebar())}
              >
                Bize Ulaşın
              </Link>

              <Link
                to="/login"
                className="flex items-center px-3 py-2.5 rounded-lg text-base font-medium text-gray-700 hover:text-blue-700 hover:bg-blue-50 transition-all duration-200"
                onClick={() => dispatch(toggleSidebar())}
              >
                Giriş Yap
              </Link>

              <div className="pt-2">
                <Link
                  to="/register"
                  className="block w-full text-center bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800 px-4 py-3 rounded-lg text-base font-medium transition duration-300 ease-in-out shadow-sm"
                  onClick={() => dispatch(toggleSidebar())}
                >
                  Hizmet Ver
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
