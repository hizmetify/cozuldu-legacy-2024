import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdDashboard, MdKeyboardArrowRight } from 'react-icons/md';
import { fetchCategories, fetchSubCategories } from '../../api/categoryApi';

const CategoryDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loadingSubCategories, setLoadingSubCategories] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (err) {
        console.error('Kategoriler yüklenirken hata oluştu:', err);
      }
    };

    getCategories();
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
        setSelectedCategory(null);
        setSubCategories([]);
      }
    }

    window.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  const handleCategoryHover = async (category) => {
    if (selectedCategory && selectedCategory._id === category._id) {
      return;
    }

    try {
      setSelectedCategory(category);
      setLoadingSubCategories(true);

      const subCategoriesData = await fetchSubCategories(category._id);
      setSubCategories(subCategoriesData);
    } catch (error) {
      console.error('Alt kategorileri yüklerken hata oluştu:', error);
      setSubCategories([]);
    } finally {
      setLoadingSubCategories(false);
    }
  };

  const handleCategoryClick = (category) => {
    navigateToCategory(category._id);
  };

  const navigateToCategory = (categoryId) => {
    navigate(`/category/${categoryId}`);
    setIsOpen(false);
    setSelectedCategory(null);
    setSubCategories([]);
  };

  return (
    <div className="relative z-50" ref={dropdownRef}>
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
                onClick={() => handleCategoryClick(category)}
                onMouseEnter={() => handleCategoryHover(category)}
                className={`px-4 py-3 text-sm hover:bg-blue-100 hover:text-blue-700 cursor-pointer rounded-lg flex justify-between items-center transition duration-200 ease-in-out ${
                  selectedCategory && selectedCategory._id === category._id
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-700'
                }`}
              >
                {category.name}
                <MdKeyboardArrowRight
                  className={`transition-transform ${
                    selectedCategory && selectedCategory._id === category._id
                      ? 'text-blue-700'
                      : 'text-gray-400'
                  }`}
                />
              </li>
            ))}
          </ul>

          {loadingSubCategories && (
            <div className="border-t border-gray-100 py-2 px-4">
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-2 text-xs text-gray-500">
                  Yükleniyor...
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {isOpen && selectedCategory && subCategories.length > 0 && (
        <div
          className="absolute left-[calc(100%_-_8px)] top-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-lg z-20 transition-opacity duration-200"
          style={{ marginLeft: '8px' }}
        >
          <div className="px-4 py-3 border-b border-gray-100 bg-blue-50 rounded-t-xl">
            <h3 className="text-sm font-medium text-blue-700">
              {selectedCategory.name}
            </h3>
          </div>
          <ul className="py-2">
            {subCategories.map((subCategory) => (
              <li
                key={subCategory._id}
                onClick={() => navigateToCategory(subCategory._id)}
                className="px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-100 hover:text-blue-700 cursor-pointer transition duration-150"
              >
                {subCategory.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CategoryDropdown;
