import { useState, useEffect } from 'react';
import {
  FiSearch,
  FiFilter,
  FiGrid,
  FiList,
  FiSliders,
  FiX,
} from 'react-icons/fi';

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
  isSubCategories=true,
  subCategories=[],
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
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const toggleFilterMenu = () => {
    setIsFilterMenuOpen(!isFilterMenuOpen);
    if (isFilterMenuOpen) setIsSortMenuOpen(false);
  };

  const toggleSortMenu = () => {
    setIsSortMenuOpen(!isSortMenuOpen);
    if (isSortMenuOpen) setIsFilterMenuOpen(false);
  };

  const toggleMobileFilter = () => {
    setIsMobileFilterOpen(!isMobileFilterOpen);
    if (!isMobileFilterOpen) {
      setIsFilterMenuOpen(false);
      setIsSortMenuOpen(false);
    }
  };

  const toggleSearchExpand = () => {
    setIsSearchExpanded(!isSearchExpanded);
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

  const currentSortLabel =
    sortOptions.find((option) => option.id === sortOption)?.label || 'Sırala';

  return (
    <div className={`filter-container ${className}`}>
      <div className="hidden md:block">
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
          <div className="flex items-center gap-2">
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
                      <form
                        onSubmit={onPriceFilterSubmit}
                        className="space-y-3"
                      >
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
                        {isSubCategories&&(<button
                          type="submit"
                          className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                        >
                          Uygula
                        </button>)}
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
      </div>
      <div className="md:hidden">
        <div className="flex items-center justify-between gap-2 mb-2">
          {!isSearchExpanded ? (
            <>
              <button
                onClick={toggleSearchExpand}
                className="flex items-center justify-center p-2 border border-gray-300 rounded-lg bg-white"
                aria-label="Ara"
              >
                <FiSearch className="text-gray-500 text-xl" />
              </button>

              <div className="flex-1 flex items-center justify-between">
                <button
                  onClick={toggleMobileFilter}
                  className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg bg-white"
                >
                  <FiFilter className="mr-1 text-gray-500" />
                  <span className="text-sm">Filtrele</span>
                  {activeFilters.length > 0 && (
                    <span className="ml-1 bg-blue-100 text-blue-800 text-xs font-medium px-1.5 py-0.5 rounded-full">
                      {activeFilters.length}
                    </span>
                  )}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const nextOption =
                        sortOption === 'newest'
                          ? 'price-low'
                          : sortOption === 'price-low'
                          ? 'price-high'
                          : 'newest';
                      onSortChange(nextOption);
                    }}
                    className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg bg-white"
                  >
                    <FiSliders className="mr-1 text-gray-500" />
                    <span className="text-sm truncate max-w-[80px]">
                      {currentSortLabel}
                    </span>
                  </button>
                  {showViewModeToggle && (
                    <button
                      onClick={() => {
                        const newMode = viewMode === 'grid' ? 'list' : 'grid';
                        onViewModeChange(newMode);
                      }}
                      className="flex items-center justify-center w-10 h-10 border border-gray-300 rounded-lg bg-white"
                      aria-label={
                        viewMode === 'grid'
                          ? 'Liste Görünümü'
                          : 'Izgara Görünümü'
                      }
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
            </>
          ) : (
            <div className="w-full flex items-center">
              <form onSubmit={onSearchSubmit} className="relative flex-1">
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  autoFocus
                />
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </form>
              <button
                onClick={toggleSearchExpand}
                className="ml-2 p-2 border border-gray-300 rounded-lg bg-white"
              >
                <FiX className="text-gray-500" />
              </button>
            </div>
          )}
        </div>
        {isSortMenuOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center p-4">
            <div className="bg-white rounded-t-xl w-full max-w-md">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">
                    Sıralama
                  </h3>
                  <button
                    onClick={() => setIsSortMenuOpen(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-4 max-h-[60vh] overflow-y-auto">
                {sortOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => {
                      onSortChange(option.id);
                      setIsSortMenuOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-3 mb-2 rounded-lg ${
                      sortOption === option.id
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'bg-gray-50 text-gray-700'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        {isMobileFilterOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex flex-col">
            <div className="bg-white rounded-t-xl w-full max-h-[90vh] mt-auto flex flex-col">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Filtreler</h3>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">
                    Fiyat Aralığı
                  </h4>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      onPriceFilterSubmit(e);
                      setIsMobileFilterOpen(false);
                    }}
                    className="space-y-3"
                  >
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
                        className="w-full px-3 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
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
                        className="w-full px-3 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </form>
                </div>
                {categories.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-3">
                      Kategoriler
                    </h4>
                    <div className="space-y-2">
                      <button
                        onClick={() => {
                          onCategoryChange('all');
                        }}
                        className={`block w-full text-left px-4 py-3 rounded-lg ${
                          selectedCategory === 'all'
                            ? 'bg-blue-50 text-blue-700 font-medium'
                            : 'bg-gray-50 text-gray-700'
                        }`}
                      >
                        {categoryAllLabel}
                      </button>
                      {categories.map((category) => (
                        <button
                          key={category._id}
                          onClick={() => {
                            onCategoryChange(category._id);
                          }}
                          className={`block w-full text-left px-4 py-3 rounded-lg ${
                            selectedCategory === category._id
                              ? 'bg-blue-50 text-blue-700 font-medium'
                              : 'bg-gray-50 text-gray-700'
                          }`}
                        >
                          {category.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {activeFilters.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">
                        Aktif Filtreler
                      </h4>
                      <button
                        onClick={onClearAllFilters}
                        className="text-sm text-blue-700 hover:text-blue-900"
                      >
                        Tümünü Temizle
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {activeFilters.map((filter, index) => (
                        <div
                          key={index}
                          className="flex items-center bg-blue-100 text-blue-800 px-3 py-2 rounded-full"
                        >
                          <span>{filter.label}</span>
                          <button
                            onClick={() => onClearFilter(filter.id)}
                            className="ml-2 text-blue-700 hover:text-blue-900"
                          >
                            <FiX className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      onClearAllFilters();
                      setIsMobileFilterOpen(false);
                    }}
                    className="py-3 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium"
                  >
                    Temizle
                  </button>
                  <button
                    onClick={() => {
                      onPriceFilterSubmit && onPriceFilterSubmit();
                      setIsMobileFilterOpen(false);
                    }}
                    className="py-3 px-4 bg-blue-600 text-white rounded-lg font-medium"
                  >
                    Uygula
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-100">
          <span className="text-sm text-gray-700">Aktif Filtreler:</span>

          {activeFilters.map((filter, index) => (
            <div
              key={index}
              className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
            >
              <span>{filter.label}</span>
              <button
                onClick={() => onClearFilter(filter.id)}
                className="ml-2 text-blue-700 hover:text-blue-900"
              >
                &times;
              </button>
            </div>
          ))}

          <button
            onClick={onClearAllFilters}
            className="text-sm text-blue-700 hover:text-blue-900 ml-auto"
          >
            Tüm Filtreleri Temizle
          </button>
        </div>
      )}
      {layout === 'expanded'&& isSubCategories && categories.length > 0 && (
        <div className="flex items-center overflow-x-auto py-3 space-x-4 mt-4 scrollbar-hide">
          <button
            onClick={() => onCategoryChange('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              selectedCategory === 'all'
                ? 'bg-blue-700 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            {categoryAllLabel}
          </button>

          {subCategories.map((category) => (
            <button
              key={category._id}
              onClick={() => onCategoryChange(category._id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === category._id
                  ? 'bg-blue-700 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
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
