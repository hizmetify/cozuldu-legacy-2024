import { useState, useEffect } from 'react';
import {
  FiSearch,
  FiFilter,
  FiGrid,
  FiList,
  FiSliders,
  FiChevronDown,
  FiChevronUp,
} from 'react-icons/fi';
import { FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';

const Filter = ({
  searchTerm = '',
  onSearchChange,
  onSearchSubmit,
  searchPlaceholder = 'Ara...',

  viewMode = 'grid',
  onViewModeChange,
  showViewModeToggle = true,

  sortOption = 'newest',
  onSortChange,
  sortOptions = [
    { id: 'newest', label: 'En Yeni' },
    { id: 'price-low', label: 'Fiyat (Düşükten Yükseğe)' },
    { id: 'price-high', label: 'Fiyat (Yüksekten Düşüğe)' },
  ],

  showFilters = true,
  priceRange = { min: '', max: '' },
  onPriceRangeChange,
  onPriceFilterSubmit,

  categories = [],
  selectedCategory = 'all',
  onCategoryChange,
  categoryAllLabel = 'Tümü',

  activeFilters = [],
  onClearFilter,
  onClearAllFilters,

  layout = 'default',
  className = '',
}) => {
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);

  const toggleFilterMenu = () => {
    setIsFilterMenuOpen(!isFilterMenuOpen);
    if (isFilterMenuOpen) setIsSortMenuOpen(false);
  };

  const toggleSortMenu = () => {
    setIsSortMenuOpen(!isSortMenuOpen);
    if (isSortMenuOpen) setIsFilterMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.filter-menu-container')) {
        setIsFilterMenuOpen(false);
        setIsSortMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={`filter-container ${className}`}>
      <div
        className={`flex ${
          layout === 'compact' ? 'flex-row' : 'flex-col md:flex-row'
        } md:items-center justify-between gap-4`}
      >
        <div className="w-full md:w-auto md:flex-1 max-w-2xl">
          <form onSubmit={onSearchSubmit} className="relative">
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </form>
        </div>
        <div className="flex items-center gap-2 mt-2 md:mt-0">
          {showFilters && (
            <div className="relative filter-menu-container">
              <button
                onClick={toggleFilterMenu}
                className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50"
              >
                <FiFilter className="mr-2 text-gray-500" />
                <span>Filtrele</span>
              </button>

              {isFilterMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 mb-3">
                      Fiyat Aralığı
                    </h3>
                    <form onSubmit={onPriceFilterSubmit} className="space-y-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          placeholder="Min"
                          value={priceRange.min}
                          onChange={(e) =>
                            onPriceRangeChange({
                              ...priceRange,
                              min: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                        <span className="text-gray-500">-</span>
                        <input
                          type="number"
                          placeholder="Max"
                          value={priceRange.max}
                          onChange={(e) =>
                            onPriceRangeChange({
                              ...priceRange,
                              max: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                      >
                        Uygula
                      </button>
                    </form>
                    {categories.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <h3 className="font-medium text-gray-900 mb-3">
                          Kategoriler
                        </h3>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          <div
                            className={`px-3 py-2 rounded-md cursor-pointer ${
                              selectedCategory === 'all'
                                ? 'bg-blue-50 text-blue-700'
                                : 'hover:bg-gray-50'
                            }`}
                            onClick={() => {
                              onCategoryChange('all');
                              setIsFilterMenuOpen(false);
                            }}
                          >
                            {categoryAllLabel}
                          </div>
                          {categories.map((category) => (
                            <div
                              key={category._id}
                              className={`px-3 py-2 rounded-md cursor-pointer ${
                                selectedCategory === category._id
                                  ? 'bg-blue-50 text-blue-700'
                                  : 'hover:bg-gray-50'
                              }`}
                              onClick={() => {
                                onCategoryChange(category._id);
                                setIsFilterMenuOpen(false);
                              }}
                            >
                              {category.name}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="relative filter-menu-container">
            <button
              onClick={toggleSortMenu}
              className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50"
            >
              <FiSliders className="mr-2 text-gray-500" />
              <span>Sırala</span>
            </button>
            {isSortMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                <div className="py-1">
                  {sortOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => {
                        onSortChange(option.id);
                        setIsSortMenuOpen(false);
                      }}
                      className={`block px-4 py-2 text-sm w-full text-left ${
                        sortOption === option.id
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          {showViewModeToggle && (
            <button
              onClick={() =>
                onViewModeChange(viewMode === 'grid' ? 'list' : 'grid')
              }
              className="flex items-center justify-center w-10 h-10 border border-gray-300 rounded-lg bg-white hover:bg-gray-50"
            >
              {viewMode === 'grid' ? (
                <FiList className="text-gray-500" />
              ) : (
                <FiGrid className="text-gray-500" />
              )}
            </button>
          )}
        </div>
      </div>
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-100">
          <span className="text-sm text-gray-500">Aktif Filtreler:</span>

          {activeFilters.map((filter, index) => (
            <div
              key={index}
              className="flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
            >
              <span>{filter.label}</span>
              <button
                onClick={() => onClearFilter(filter.id)}
                className="ml-2 text-blue-500 hover:text-blue-700"
              >
                &times;
              </button>
            </div>
          ))}

          <button
            onClick={onClearAllFilters}
            className="text-sm text-blue-600 hover:text-blue-800 ml-auto"
          >
            Tüm Filtreleri Temizle
          </button>
        </div>
      )}
      {layout === 'expanded' && categories.length > 0 && (
        <div className="flex items-center overflow-x-auto py-3 space-x-4 mt-4">
          <button
            onClick={() => onCategoryChange('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {categoryAllLabel}
          </button>

          {categories.map((category) => (
            <button
              key={category._id}
              onClick={() => onCategoryChange(category._id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === category._id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Filter;
