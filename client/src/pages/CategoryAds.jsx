import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdsByCategory, clearCategoryAds } from '../features/ad/adSlice';
import { fetchCategories, fetchSubCategories } from '../api/categoryApi';
import { startLoading, stopLoading } from '../features/loading/loadingSlice';
import { FiSliders, FiStar, FiMapPin, FiClock, FiSearch } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/Header/Header';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import AdCard from '../components/MyAds/AdCard';
import Filter from '../components/UI/Filter';
import MetaHelmet from '../utils/MetaHelmet';

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
  const [currentPage, setCurrentPage] = useState(1);
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

  const activeFilters = [];

  if (selectedSubCategory !== 'all') {
    const subCategoryName =
      subCategories.find((sc) => sc._id === selectedSubCategory)?.name ||
      'Alt Kategori';
    activeFilters.push({ id: 'subCategory', label: subCategoryName });
  }

  if (priceRange.min || priceRange.max) {
    activeFilters.push({
      id: 'price',
      label: `Fiyat: ${priceRange.min || '0'}₺ - ${priceRange.max || '∞'}₺`,
    });
  }

  if (searchTerm) {
    activeFilters.push({ id: 'search', label: `Arama: ${searchTerm}` });
  }

  const handleClearFilter = (filterId) => {
    if (filterId === 'subCategory') {
      setSelectedSubCategory('all');
    } else if (filterId === 'price') {
      setPriceRange({ min: '', max: '' });
    } else if (filterId === 'search') {
      setSearchTerm('');
    }
  };

  const handleClearAllFilters = () => {
    setSelectedSubCategory('all');
    setPriceRange({ min: '', max: '' });
    setSearchTerm('');
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

  // Meta bilgileri için dinamik değerler oluştur
  const metaTitle = `${category?.name || 'Kategori'} İlanları - Çözüldü`;
  const metaDescription = `${
    category?.name || 'Kategori'
  } kategorisindeki en güncel hizmet ilanlarını keşfedin. ${
    totalAds || ''
  } ilan arasından size uygun hizmeti bulun.`;
  const metaKeywords = `${
    category?.name || 'kategori'
  }, hizmet ilanları, ${subCategories
    .slice(0, 3)
    .map((sc) => sc.name)
    .join(', ')}`;
  const canonical = `https://xn--zld-1la9esbc.com/category/${categoryId}`;

  if (loading && !ads.length) {
    return (
      <>
        <MetaHelmet
          title={metaTitle}
          description={metaDescription}
          keywords={metaKeywords}
          canonical={canonical}
        />
        <Header />
      </>
    );
  }

  if (error) {
    return (
      <>
        <MetaHelmet
          title={metaTitle}
          description={metaDescription}
          keywords={metaKeywords}
          canonical={canonical}
        />
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
      <MetaHelmet
        title={metaTitle}
        description={metaDescription}
        keywords={metaKeywords}
        canonical={canonical}
        ogImage={
          ads.length > 0 && ads[0].images?.length > 0
            ? ads[0].images[0]
            : undefined
        }
      />

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
            <Filter
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onSearchSubmit={handleSearch}
              searchPlaceholder="İlan ara..."
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              sortOption={sortOption}
              onSortChange={setSortOption}
              sortOptions={[
                { id: 'newest', label: 'En Yeni' },
                { id: 'price-low', label: 'Fiyat (Düşükten Yükseğe)' },
                { id: 'price-high', label: 'Fiyat (Yüksekten Düşüğe)' },
              ]}
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
              onPriceFilterSubmit={handlePriceFilter}
              categories={subCategories}
              selectedCategory={selectedSubCategory}
              onCategoryChange={setSelectedSubCategory}
              categoryAllLabel={`Tüm ${category?.name || 'Kategoriler'}`}
              activeFilters={activeFilters}
              onClearFilter={handleClearFilter}
              onClearAllFilters={handleClearAllFilters}
              layout="expanded"
            />
          </div>
        </div>

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
                onClick={handleClearAllFilters}
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
                      <Link key={ad._id} to={`/ad/${ad._id}`}>
                        <AdCard
                          ad={ad}
                          isManageable={false}
                          isFeatured={true}
                          showLocation={true}
                          showDate={true}
                          linkTo={`/ad/${ad._id}`}
                        />
                      </Link>
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
                                {ad.location || ad.city || 'Konum belirtilmedi'}
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
                      &lt;
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
                      &gt;
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
