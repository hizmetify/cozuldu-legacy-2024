
import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { fetchAdsByCategory, clearCategoryAds } from '../features/ad/adSlice';
import { fetchCategories, fetchSubCategories } from '../api/categoryApi';
import { startLoading, stopLoading } from '../features/loading/loadingSlice';
import {
  FiSearch,
  FiFilter,
  FiGrid,
  FiList,
  FiStar,
  FiMapPin,
  FiClock,
  FiChevronDown,
  FiChevronUp,
  FiSliders,
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/Header/Header';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const CategoryAds = () => {
  const { categoryId } = useParams();
  const dispatch = useDispatch();
  const {
    data: ads,
    total: totalAds,
    loading,
    error,
  } = useSelector((state) => state.ads.categoryAds);

  const [category, setCategory] = useState(null);
  const [subCategories, setSubCategories] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [selectedSubCategory, setSelectedSubCategory] = useState('all');
  const [sortOption, setSortOption] = useState('newest');
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const itemsPerPage = 12;

  useEffect(() => {
    if (loading && !ads.length) {
      dispatch(startLoading({ message: 'İlanlar yükleniyor' }));
    } else if (loading) {
      dispatch(
        startLoading({
          message: 'Daha fazla ilan yükleniyor',
          fullScreen: false,
        })
      );
    } else {
      dispatch(stopLoading());
    }
  }, [loading, ads.length, dispatch]);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const categories = await fetchCategories();
        const currentCategory = categories.find(
          (cat) => cat._id === categoryId
        );

        if (currentCategory) {
          setCategory(currentCategory);

          try {
            const subCategoriesData = await fetchSubCategories(categoryId);
            setSubCategories(subCategoriesData);
          } catch (subCatError) {
            console.warn('Alt kategoriler yüklenemedi:', subCatError);
            setSubCategories([]);
          }
        }
      } catch (err) {
        console.error('Kategori bilgileri yüklenirken hata oluştu:', err);
      }
    };

    fetchCategoryData();

    return () => {
      dispatch(clearCategoryAds());
    };
  }, [categoryId, dispatch]);
  useEffect(() => {
    const filters = {
      sort:
        sortOption === 'newest'
          ? 'createdAt'
          : sortOption === 'price-low'
          ? 'price'
          : sortOption === 'price-high'
          ? 'price'
          : 'createdAt',
      order:
        sortOption === 'price-high'
          ? 'desc'
          : sortOption === 'newest'
          ? 'desc'
          : 'asc',
      page: currentPage,
      limit: itemsPerPage,
      search: searchTerm,
      priceMin: priceRange.min || undefined,
      priceMax: priceRange.max || undefined,
    };

    dispatch(
      fetchAdsByCategory({
        categoryId:
          selectedSubCategory === 'all' ? categoryId : selectedSubCategory,
        filters,
      })
    );
  }, [
    categoryId,
    selectedSubCategory,
    sortOption,
    currentPage,
    searchTerm,
    priceRange,
    dispatch,
  ]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handlePriceFilter = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const totalPages = Math.ceil(totalAds / itemsPerPage);

  const pagination = useMemo(() => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 3) {
        end = Math.min(totalPages - 1, 4);
      }

      if (currentPage >= totalPages - 2) {
        start = Math.max(2, totalPages - 3);
      }

      if (start > 2) {
        pages.push('...');
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 1) {
        pages.push('...');
      }

      pages.push(totalPages);
    }

    return pages;
  }, [currentPage, totalPages]);

  if (loading && !ads.length) {
    return (
      <>
        <Header />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-6 rounded-md shadow-md">
            <div className="flex items-center">
              <FiSliders className="text-2xl mr-4 text-red-500" />
              <div>
                <p className="font-bold text-lg mb-1">Bir hata oluştu</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
            <div className="mt-4">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Yeniden Dene
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{category?.name || 'Kategori'} İlanları - Çözüldü</title>
        <meta
          name="description"
          content={`${category?.name || 'Kategori'} ile ilgili hizmet ilanları`}
        />
      </Helmet>

      <Header />

      <main className="bg-gray-50 min-h-screen">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold">{category?.name} İlanları</h1>
            <p className="mt-2 text-blue-100">{totalAds} ilan bulundu</p>
          </div>
        </div>

        <div className="bg-white border-b shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="w-full md:w-auto md:flex-1 max-w-2xl">
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    placeholder="İlan ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700"
                  >
                    Ara
                  </button>
                </form>
              </div>

              <div className="flex items-center gap-2 mt-2 md:mt-0">
                <div className="relative">
                  <button
                    onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
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
                          onSubmit={handlePriceFilter}
                          className="space-y-3"
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              placeholder="Min"
                              value={priceRange.min}
                              onChange={(e) =>
                                setPriceRange({
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
                                setPriceRange({
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

                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <h3 className="font-medium text-gray-900 mb-3">
                            Alt Kategoriler
                          </h3>
                          <div className="space-y-2 max-h-48 overflow-y-auto">
                            <div
                              className={`px-3 py-2 rounded-md cursor-pointer ${
                                selectedSubCategory === 'all'
                                  ? 'bg-blue-50 text-blue-700'
                                  : 'hover:bg-gray-50'
                              }`}
                              onClick={() => {
                                setSelectedSubCategory('all');
                                setIsFilterMenuOpen(false);
                              }}
                            >
                              Tümü
                            </div>
                            {subCategories.map((subCat) => (
                              <div
                                key={subCat._id}
                                className={`px-3 py-2 rounded-md cursor-pointer ${
                                  selectedSubCategory === subCat._id
                                    ? 'bg-blue-50 text-blue-700'
                                    : 'hover:bg-gray-50'
                                }`}
                                onClick={() => {
                                  setSelectedSubCategory(subCat._id);
                                  setIsFilterMenuOpen(false);
                                }}
                              >
                                {subCat.name}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="relative">
                  <button
                    onClick={() => setIsSortMenuOpen(!isSortMenuOpen)}
                    className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50"
                  >
                    <FiSliders className="mr-2 text-gray-500" />
                    <span>Sırala</span>
                  </button>
                  {isSortMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                      <div className="py-1">
                        <button
                          onClick={() => {
                            setSortOption('newest');
                            setIsSortMenuOpen(false);
                          }}
                          className={`block px-4 py-2 text-sm w-full text-left ${
                            sortOption === 'newest'
                              ? 'bg-blue-50 text-blue-700'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          En Yeni
                        </button>
                        <button
                          onClick={() => {
                            setSortOption('price-low');
                            setIsSortMenuOpen(false);
                          }}
                          className={`block px-4 py-2 text-sm w-full text-left ${
                            sortOption === 'price-low'
                              ? 'bg-blue-50 text-blue-700'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          Fiyat (Düşükten Yükseğe)
                        </button>
                        <button
                          onClick={() => {
                            setSortOption('price-high');
                            setIsSortMenuOpen(false);
                          }}
                          className={`block px-4 py-2 text-sm w-full text-left ${
                            sortOption === 'price-high'
                              ? 'bg-blue-50 text-blue-700'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          Fiyat (Yüksekten Düşüğe)
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <button
                  onClick={() =>
                    setViewMode(viewMode === 'grid' ? 'list' : 'grid')
                  }
                  className="flex items-center justify-center w-10 h-10 border border-gray-300 rounded-lg bg-white hover:bg-gray-50"
                >
                  {viewMode === 'grid' ? (
                    <FiList className="text-gray-500" />
                  ) : (
                    <FiGrid className="text-gray-500" />
                  )}
                </button>
              </div>
            </div>
            {(selectedSubCategory !== 'all' ||
              priceRange.min ||
              priceRange.max ||
              searchTerm) && (
              <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                <span className="text-sm text-gray-500">Aktif Filtreler:</span>

                {selectedSubCategory !== 'all' && (
                  <div className="flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                    <span>
                      {subCategories.find(
                        (sc) => sc._id === selectedSubCategory
                      )?.name || 'Alt Kategori'}
                    </span>
                    <button
                      onClick={() => setSelectedSubCategory('all')}
                      className="ml-2 text-blue-500 hover:text-blue-700"
                    >
                      &times;
                    </button>
                  </div>
                )}

                {(priceRange.min || priceRange.max) && (
                  <div className="flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                    <span>
                      Fiyat: {priceRange.min || '0'}₺ - {priceRange.max || '∞'}₺
                    </span>
                    <button
                      onClick={() => setPriceRange({ min: '', max: '' })}
                      className="ml-2 text-blue-500 hover:text-blue-700"
                    >
                      &times;
                    </button>
                  </div>
                )}

                {searchTerm && (
                  <div className="flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                    <span>Arama: {searchTerm}</span>
                    <button
                      onClick={() => setSearchTerm('')}
                      className="ml-2 text-blue-500 hover:text-blue-700"
                    >
                      &times;
                    </button>
                  </div>
                )}

                <button
                  onClick={() => {
                    setSelectedSubCategory('all');
                    setPriceRange({ min: '', max: '' });
                    setSearchTerm('');
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800 ml-auto"
                >
                  Tüm Filtreleri Temizle
                </button>
              </div>
            )}
          </div>
        </div>
        {subCategories.length > 0 && (
          <div className="bg-white border-b shadow-sm hidden md:block">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center overflow-x-auto py-3 space-x-4">
                <button
                  onClick={() => setSelectedSubCategory('all')}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedSubCategory === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Tüm {category?.name}
                </button>

                {subCategories.map((subCat) => (
                  <button
                    key={subCat._id}
                    onClick={() => setSelectedSubCategory(subCat._id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                      selectedSubCategory === subCat._id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {subCat.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {loading && (
            <div className="flex justify-center my-8">
              <LoadingSpinner
                message="Daha fazla ilan yükleniyor"
                fullScreen={false}
              />
            </div>
          )}

          {!loading && ads.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                <FiSearch className="text-blue-500 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Sonuç bulunamadı
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Arama kriterlerinize uygun ilan bulunamadı. Lütfen farklı
                filtreler deneyiniz.
              </p>
              <button
                onClick={() => {
                  setSelectedSubCategory('all');
                  setPriceRange({ min: '', max: '' });
                  setSearchTerm('');
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                Tüm Filtreleri Temizle
              </button>
            </div>
          ) : (
            <>
              {viewMode === 'grid' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  <AnimatePresence>
                    {ads.map((ad) => (
                      <motion.div
                        key={ad._id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        whileHover={{
                          y: -5,
                          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                        }}
                        transition={{ duration: 0.2 }}
                        className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                      >
                        <Link to={`/ad/${ad._id}`} className="block">
                          <div className="relative h-48 overflow-hidden">
                            <img
                              src={
                                ad.images?.length
                                  ? ad.images[0]
                                  : 'https://via.placeholder.com/300x200?text=Resim+Yok'
                              }
                              alt={ad.title}
                              className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                            />
                            {ad.featured && (
                              <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-800 text-xs font-bold px-2 py-1 rounded">
                                <FiStar className="inline mr-1" />
                                Öne Çıkan
                              </div>
                            )}
                          </div>
                          <div className="p-5">
                            <h3 className="font-bold text-lg text-gray-900 line-clamp-1 mb-2">
                              {ad.title}
                            </h3>
                            <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                              {ad.description || 'Açıklama bulunmuyor'}
                            </p>
                            <div className="flex justify-between items-center">
                              <span className="text-lg font-bold text-blue-600">
                                {ad.price
                                  ? `${ad.price}₺`
                                  : 'Fiyat Belirtilmedi'}
                              </span>
                              <span className="text-xs text-gray-500">
                                {ad.priceType || 'saatlik'}
                              </span>
                            </div>
                          </div>
                          <div className="border-t border-gray-100 p-4 bg-gray-50">
                            <div className="flex justify-between text-xs text-gray-500">
                              <div className="flex items-center">
                                <FiMapPin className="mr-1" />
                                {ad.location || 'Konum belirtilmedi'}
                              </div>
                              <div className="flex items-center">
                                <FiClock className="mr-1" />
                                {new Date(ad.createdAt).toLocaleDateString(
                                  'tr-TR'
                                )}
                              </div>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
              {viewMode === 'list' && (
                <div className="space-y-4">
                  <AnimatePresence>
                    {ads.map((ad) => (
                      <motion.div
                        key={ad._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300"
                      >
                        <Link
                          to={`/ad/${ad._id}`}
                          className="flex flex-col sm:flex-row"
                        >
                          <div className="sm:w-48 md:w-64 h-48 sm:h-auto relative">
                            <img
                              src={
                                ad.images?.length
                                  ? ad.images[0]
                                  : 'https://via.placeholder.com/300x200?text=Resim+Yok'
                              }
                              alt={ad.title}
                              className="w-full h-full object-cover"
                            />
                            {ad.featured && (
                              <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-800 text-xs font-bold px-2 py-1 rounded">
                                <FiStar className="inline mr-1" />
                                Öne Çıkan
                              </div>
                            )}
                          </div>
                          <div className="flex-1 p-5">
                            <h3 className="font-bold text-xl text-gray-900 mb-2">
                              {ad.title}
                            </h3>
                            <p className="text-gray-600 mb-4 line-clamp-2">
                              {ad.description || 'Açıklama bulunmuyor'}
                            </p>
                            <div className="flex flex-wrap items-center justify-between mt-auto">
                              <div className="flex items-center text-gray-500 text-sm mb-2 sm:mb-0">
                                <FiMapPin className="mr-1" />
                                {ad.location || 'Konum belirtilmedi'}
                              </div>
                              <div className="flex items-center text-gray-500 text-sm">
                                <FiClock className="mr-1" />
                                {new Date(ad.createdAt).toLocaleDateString(
                                  'tr-TR'
                                )}
                              </div>
                              <div className="w-full sm:w-auto mt-3 sm:mt-0">
                                <span className="text-xl font-bold text-blue-600 block">
                                  {ad.price
                                    ? `${ad.price}₺`
                                    : 'Fiyat Belirtilmedi'}
                                  <span className="text-xs text-gray-500 ml-1">
                                    {ad.priceType || 'saatlik'}
                                  </span>
                                </span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}

              {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <nav className="flex items-center space-x-1">
                    <button
                      onClick={() =>
                        setCurrentPage(Math.max(1, currentPage - 1))
                      }
                      disabled={currentPage === 1}
                      className={`px-3 py-2 rounded-md ${
                        currentPage === 1
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span className="sr-only">Önceki</span>
                      <FiChevronUp className="rotate-90" />
                    </button>

                    {pagination.map((page, index) => (
                      <button
                        key={index}
                        onClick={() =>
                          typeof page === 'number' && setCurrentPage(page)
                        }
                        disabled={page === '...'}
                        className={`px-3 py-2 rounded-md ${
                          page === currentPage
                            ? 'bg-blue-600 text-white'
                            : page === '...'
                            ? 'text-gray-400'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      onClick={() =>
                        setCurrentPage(Math.min(totalPages, currentPage + 1))
                      }
                      disabled={currentPage === totalPages}
                      className={`px-3 py-2 rounded-md ${
                        currentPage === totalPages
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span className="sr-only">Sonraki</span>
                      <FiChevronDown className="rotate-90" />
                    </button>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </>
  );
};

export default CategoryAds;
