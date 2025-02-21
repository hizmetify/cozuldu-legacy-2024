import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // 📌 useNavigate ekledik
import { MdDashboard, MdKeyboardArrowRight } from 'react-icons/md';
import { fetchCategories, fetchSubCategories } from '../../api/categoryApi';

const CategoryDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories()
      .then((data) => setCategories(data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
        setSelectedCategory(null);
      }
    }
    window.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCategoryClick = async (category) => {
    setSelectedCategory(category);
    try {
      const subCategoriesData = await fetchSubCategories(category._id);
      setSubCategories(subCategoriesData);
    } catch (error) {
      console.error('Alt kategorileri yüklerken hata oluştu:', error);
    }
  };

  const handleNavigateToCategory = (categoryId) => {
    navigate(`/category/${categoryId}`); 
    setIsOpen(false);
  };

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
                onClick={() => handleNavigateToCategory(category._id)} 
                className="px-4 py-3 text-sm text-gray-700 hover:bg-blue-100 hover:text-blue-700 cursor-pointer rounded-lg flex justify-between items-center transition duration-200 ease-in-out"
              >
                {category.name}
                <MdKeyboardArrowRight className="text-gray-500" />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CategoryDropdown;
