import { useState, useRef, useEffect } from 'react';
import { MdDashboard } from 'react-icons/md';
import { fetchCategories } from '../../api/categoryApi';

const CategoryDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchCategories()
      .then((data) => setCategories(data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    window.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-700 text-white text-sm font-semibold rounded shadow-md hover:from-blue-600 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition duration-300"
      >
        Kategoriler
        <MdDashboard className="ml-2 text-white text-xl" />
      </button>
      {isOpen && (
        <div className="absolute left-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-lg z-10">
          <ul className="py-2 divide-y divide-gray-100">
            {categories.map((category) => (
              <li
                key={category._id}
                className="px-4 py-3 text-sm text-gray-700 hover:bg-blue-100 hover:text-blue-700 cursor-pointer rounded-lg transition duration-200 ease-in-out"
              >
                {category.name}
              </li>
            ))}
          </ul>
          {categories.length === 0 && (
            <div className="px-4 py-3 text-sm text-gray-500 text-center">
              Kategori bulunamadı
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryDropdown;
