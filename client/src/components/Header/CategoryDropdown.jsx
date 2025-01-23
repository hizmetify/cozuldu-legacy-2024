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
  });

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
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 transition duration-150 ease-in-out"
      >
        Kategoriler
        <MdDashboard className="ml-2 text-blue-600 text-lg" />
      </button>
      {isOpen && (
        <div className="absolute left-0 mt-2 w-48 bg-white border rounded shadow">
          <ul className="py-2">
            {categories.map((category) => (
              <li
                key={category._id}
                className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
              >
                {category.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CategoryDropdown;
