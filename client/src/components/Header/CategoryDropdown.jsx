import { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MdDashboard,
  MdKeyboardArrowRight,
  MdClose,
  MdSearch,
} from 'react-icons/md';
import { fetchCategories, fetchSubCategories } from '../../api/categoryApi';

const CategoryDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loadingSubCategories, setLoadingSubCategories] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [hoverTimer, setHoverTimer] = useState(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [preloadedCategories, setPreloadedCategories] = useState({});
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);

        if (data.length > 0) {
          const preloaded = {};
          for (let i = 0; i < Math.min(3, data.length); i++) {
            try {
              const subCats = await fetchSubCategories(data[i]._id);
              preloaded[data[i]._id] = subCats;
            } catch (err) {
              console.error(
                `Error preloading subcategories for ${data[i].name}:`,
                err
              );
            }
          }
          setPreloadedCategories(preloaded);
        }
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
        setSearchQuery('');
        setActiveIndex(-1);
      }
    }

    window.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current.focus();
      }, 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setActiveIndex((prev) =>
            prev < filteredCategories.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev));
          break;
        case 'Enter':
          e.preventDefault();
          if (activeIndex >= 0 && activeIndex < filteredCategories.length) {
            handleCategoryClick(filteredCategories[activeIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          setIsOpen(false);
          setSearchQuery('');
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, activeIndex, categories, searchQuery]);

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;

    const query = searchQuery.toLowerCase().trim();
    return categories.filter((category) =>
      category.name.toLowerCase().includes(query)
    );
  }, [categories, searchQuery]);

  const handleCategoryHover = (category, index) => {
    if (hoverTimer) {
      clearTimeout(hoverTimer);
    }
    setActiveIndex(index);

    const timer = setTimeout(async () => {
      if (selectedCategory && selectedCategory._id === category._id) {
        return;
      }

      setSelectedCategory(category);
      if (preloadedCategories[category._id]) {
        setSubCategories(preloadedCategories[category._id]);
        return;
      }

      try {
        setLoadingSubCategories(true);
        const subCategoriesData = await fetchSubCategories(category._id);
        setSubCategories(subCategoriesData);
        setPreloadedCategories((prev) => ({
          ...prev,
          [category._id]: subCategoriesData,
        }));
      } catch (error) {
        console.error('Alt kategorileri yüklerken hata oluştu:', error);
        setSubCategories([]);
      } finally {
        setLoadingSubCategories(false);
      }
    }, 150);

    setHoverTimer(timer);
  };

  const handleCategoryClick = (category) => {
    navigateToCategory(category._id);
  };

  const navigateToCategory = (categoryId) => {
    navigate(`/category/${categoryId}`);
    setIsOpen(false);
    setSelectedCategory(null);
    setSubCategories([]);
    setSearchQuery('');
  };

  const highlightMatch = (text, query) => {
    if (!query.trim()) return text;

    const regex = new RegExp(`(${query.trim()})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, i) =>
      regex.test(part) ? (
        <span key={i} className="bg-yellow-100 text-blue-800">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      setSearchQuery('');
      setSelectedCategory(null);
      setSubCategories([]);
    }
  };

  return (
    <div className="relative z-50" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className={`
          inline-flex items-center px-5 py-2.5 
          bg-gradient-to-r from-blue-500 to-blue-700 
          text-white text-sm font-semibold rounded-lg
          shadow-md hover:shadow-lg hover:from-blue-600 hover:to-blue-800 
          focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 
          transition-all duration-300 ease-in-out
          ${isOpen ? 'ring-2 ring-blue-400 ring-offset-2' : ''}
        `}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span>Kategoriler</span>
        <MdDashboard className="ml-2 text-white text-xl" />
      </button>

      {isOpen && (
        <div
          className="absolute left-0 mt-3 w-72 bg-white border border-gray-100 rounded-xl shadow-xl z-10 overflow-hidden"
          style={{
            animation: 'fadeInDown 0.25s ease-out forwards',
            transformOrigin: 'top center',
          }}
          role="menu"
          aria-orientation="vertical"
        >
          <div className="px-4 pt-3 pb-2 relative">
            <div className="relative">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Kategori ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 pr-10 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                aria-label="Kategorilerde ara"
              />
              <MdSearch className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />

              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Aramayı temizle"
                >
                  <MdClose className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          <div className="max-h-[400px] overflow-y-auto py-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            {filteredCategories.length > 0 ? (
              <ul className="divide-y divide-gray-50">
                {filteredCategories.map((category, index) => (
                  <li
                    key={category._id}
                    onClick={() => handleCategoryClick(category)}
                    onMouseEnter={() => handleCategoryHover(category, index)}
                    className={`
                      px-4 py-3 text-sm cursor-pointer
                      flex justify-between items-center
                      transition-all duration-200 ease-in-out
                      ${
                        activeIndex === index
                          ? 'bg-blue-50 text-blue-700 font-medium'
                          : 'text-gray-700 hover:bg-blue-50/50 hover:text-blue-600'
                      }
                    `}
                    role="menuitem"
                    tabIndex={0}
                  >
                    <div className="flex items-center">
                      <span
                        className={`
                        w-1.5 h-1.5 rounded-full mr-2 opacity-70
                        ${activeIndex === index ? 'bg-blue-600' : 'bg-blue-400'}
                        transition-all duration-200
                      `}
                      ></span>
                      <span>{highlightMatch(category.name, searchQuery)}</span>
                    </div>
                    <MdKeyboardArrowRight
                      className={`
                        transition-transform duration-200
                        ${
                          activeIndex === index
                            ? 'text-blue-700 transform translate-x-1'
                            : 'text-gray-400'
                        }
                      `}
                      size={20}
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-4 py-8 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-3">
                  <MdSearch className="h-6 w-6 text-gray-400" />
                </div>
                <p className="text-gray-500 text-sm">
                  "{searchQuery}" için sonuç bulunamadı
                </p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-2 text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  Tüm kategorileri göster
                </button>
              </div>
            )}
          </div>
          {loadingSubCategories && (
            <div className="border-t border-gray-100 py-3 px-4 bg-gray-50">
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-2 text-xs text-gray-500">
                  Yükleniyor...
                </span>
              </div>
            </div>
          )}

          <div className="border-t border-gray-100 px-4 py-2 bg-gray-50/50">
            <div className="flex justify-between text-xs text-gray-400">
              <div className="flex items-center">
                <span className="inline-block px-1.5 py-0.5 bg-gray-100 rounded mr-1">
                  ↑
                </span>
                <span className="inline-block px-1.5 py-0.5 bg-gray-100 rounded mr-1">
                  ↓
                </span>
                <span>Gezinmek için</span>
              </div>
              <div className="flex items-center">
                <span className="inline-block px-1.5 py-0.5 bg-gray-100 rounded mr-1">
                  Enter
                </span>
                <span>Seçmek için</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {isOpen && selectedCategory && subCategories.length > 0 && (
        <div
          className="absolute left-[calc(100%_-_8px)] top-0 mt-3 w-72 bg-white border border-gray-100 rounded-xl shadow-xl z-20 overflow-hidden"
          style={{
            marginLeft: '8px',
            animation: 'fadeInRight 0.2s ease-out forwards',
            transformOrigin: 'left center',
          }}
          role="menu"
          aria-orientation="vertical"
        >
          <div className="px-5 py-3.5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-xl">
            <h3 className="text-sm font-medium text-blue-700 flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2"></span>
              {selectedCategory.name}
            </h3>
          </div>
          <div className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            <ul className="py-2">
              {subCategories.map((subCategory, index) => (
                <li
                  key={subCategory._id}
                  onClick={() => navigateToCategory(subCategory._id)}
                  className="group relative px-5 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 cursor-pointer transition-all duration-150"
                  role="menuitem"
                >
                  <div className="flex items-center">
                    <span className="w-1 h-1 rounded-full bg-gray-400 group-hover:bg-blue-500 mr-2 transition-colors duration-200"></span>
                    {subCategory.name}
                  </div>
{/* 
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <span className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                      {Math.floor(Math.random() * 50) + 5}
                    </span>
                  </div> */}
                </li>
              ))}
            </ul>
          </div>

          <div className="px-5 py-3 border-t border-gray-100 bg-gray-50">
            <button
              onClick={() => navigateToCategory(selectedCategory._id)}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center transition-colors duration-150"
            >
              Tüm {selectedCategory.name} Kategorilerini Gör
              <svg
                className="ml-1 h-3 w-3"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default CategoryDropdown;
