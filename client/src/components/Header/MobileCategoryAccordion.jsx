import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md';
import { fetchCategories, fetchSubCategories } from '../../api/categoryApi';
import { useDispatch } from 'react-redux';
import { toggleSidebar } from '../../features/sidebar/sidebarSlice';

const MobileCategoryAccordion = () => {
  const [categories, setCategories] = useState([]);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [loadingStates, setLoadingStates] = useState({});
  const [categorySubcategories, setCategorySubcategories] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();

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

  const handleChevronClick = async (categoryId) => {
    if (expandedCategory === categoryId) {
      setExpandedCategory(null);
      return;
    }
    if (categorySubcategories[categoryId]) {
      setExpandedCategory(categoryId);
      return;
    }

    try {
      setLoadingStates((prev) => ({ ...prev, [categoryId]: true }));
      setExpandedCategory(categoryId);

      const subCategoriesData = await fetchSubCategories(categoryId);

      setCategorySubcategories((prev) => ({
        ...prev,
        [categoryId]: subCategoriesData,
      }));
    } catch (error) {
      console.error('Alt kategorileri yüklerken hata oluştu:', error);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [categoryId]: false }));
    }
  };

  const navigateToCategory = (categoryId) => {
    navigate(`/category/${categoryId}`);
    dispatch(toggleSidebar());
  };

  return (
    <div className="rounded-lg overflow-hidden">
      <div className="text-sm font-medium text-blue-700 px-3 py-2">
        Kategoriler
      </div>

      <div className="space-y-1">
        {categories.map((category) => (
          <div
            key={category._id}
            className="border-b border-gray-100 last:border-b-0"
          >
            <div className="w-full flex items-center justify-between px-3 py-3 text-left text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-md transition-colors duration-150">
              <span
                onClick={() => navigateToCategory(category._id)}
                className="cursor-pointer"
              >
                {category.name}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleChevronClick(category._id);
                }}
                className="flex items-center"
              >
                {loadingStates[category._id] ? (
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-1"></div>
                ) : expandedCategory === category._id ? (
                  <MdKeyboardArrowUp className="text-blue-600 text-xl" />
                ) : (
                  <MdKeyboardArrowDown className="text-gray-400 text-xl" />
                )}
              </button>
            </div>
            {expandedCategory === category._id && (
              <div className="bg-blue-50 rounded-md mx-2 mb-2 overflow-hidden transition-all duration-300 ease-in-out">
                {categorySubcategories[category._id]?.length > 0 ? (
                  <ul className="py-1">
                    {categorySubcategories[category._id].map((subCategory) => (
                      <li key={subCategory._id}>
                        <button
                          onClick={() => navigateToCategory(subCategory._id)}
                          className="w-full text-left px-6 py-2 text-sm text-gray-600 hover:bg-blue-100 hover:text-blue-700 transition-colors duration-150"
                        >
                          {subCategory.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="px-6 py-3 text-sm text-gray-500">
                    Alt kategori bulunamadı
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MobileCategoryAccordion;
