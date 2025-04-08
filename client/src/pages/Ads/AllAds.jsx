

import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { 
    clearCategoryAds,
  fetchAllAds,
} from '../../features/ad/adSlice';
import LoadingSpinner from '../../components/UI/LoadingSpinner'; 
import { 
  FaSortAmountUp,
  FaSortAmountDown,
} from 'react-icons/fa';
import {
  FiPlus,
  FiAlertCircle,
  FiSearch,
  FiEyeOff,
  FiEye,
  FiGrid,
  FiMoreVertical,
} from 'react-icons/fi'; 
import { emailSend } from '../../api/authApi';
import { motion, AnimatePresence } from 'framer-motion';
import AdCard from '../../components/MyAds/AdCard';
import Filter from '../../components/UI/Filter';
import MetaHelmet from '../../utils/MetaHelmet'; 
import { fetchAdsByCategory } from '../../api/categoryApi';

// const EmptyState = ({ onAddNew }) => (
//   <motion.div
//     initial={{ opacity: 0, y: 20 }}
//     animate={{ opacity: 1, y: 0 }}
//     className="text-center p-6 md:p-12 bg-white shadow-md rounded-lg"
//   >
//     <div className="mx-auto w-20 h-20 md:w-24 md:h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6">
//       <FiPlus className="text-blue-700 text-2xl md:text-3xl" />
//     </div>
//     <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
//       Henüz bir ilanınız yok
//     </h3>
//     <p className="text-gray-700 mb-6 max-w-md mx-auto">
//       İlk ilanınızı ekleyerek hizmetlerinizi potansiyel müşterilerinize
//       göstermeye başlayın.
//     </p>
//     <button
//       onClick={onAddNew}
//       className="inline-flex items-center px-5 py-2.5 md:px-6 md:py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
//     >
//       <FiPlus className="mr-2" />
//       Yeni İlan Ekle
//     </button>
//   </motion.div>
// );

const LoadingState = () => <LoadingSpinner message="İlanlar Yükleniyor" />;

const ErrorState = ({ error }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="bg-red-50 border-l-4 border-red-500 text-red-700 p-6 rounded-md shadow-md"
    role="alert"
  >
    <div className="flex items-center">
      <FiAlertCircle className="text-2xl mr-4 text-red-500" />
      <div>
        <p className="font-bold text-lg mb-1">
          İşlem sırasında bir hata oluştu
        </p>
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
  </motion.div>
);

const AdStatusBadge = ({ status }) => {
  let color = 'bg-gray-100 text-gray-700';
  if (status === 'active') {
    color = 'bg-green-100 text-green-800';
  } else if (status === 'pending') {
    color = 'bg-yellow-100 text-yellow-800';
  } else if (status === 'pasif') {
    color = 'bg-red-100 text-red-800';
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}
    >
      {status === 'active'
        ? 'Aktif'
        : status === 'pending'
        ? 'Onay Bekliyor'
        : 'Pasif'}
    </span>
  );
};

const MobileListCard = ({
  ad,
  onView
}) => {
  const [showActions, setShowActions] = useState(false);

  const toggleActions = (e) => {
    e.stopPropagation();
    setShowActions(!showActions);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-white rounded-lg shadow-md overflow-hidden mb-3"
      onClick={() => onView(ad._id)}
    >
      <div className="flex items-center p-3">
        <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0 mr-3">
          <img
            src={
              ad.images?.length
                ? ad.images[0]
                : 'https://via.placeholder.com/300x200?text=Resim+Yok'
            }
            alt={ad.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 mb-1 truncate">
            {ad.title}
          </h3>
          <div className="flex items-center mb-1">
            <span className="text-blue-700 font-medium mr-2">
              {ad.price ? `${ad.price}₺` : 'Fiyat Belirtilmedi'}
            </span>
            <span className="text-xs text-gray-700">
              {ad.priceType || 'saatlik'}
            </span>
          </div>
          <AdStatusBadge status={ad.status || 'active'} />
        </div>
        <div className="ml-2">
          <button
            onClick={toggleActions}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
          >
            <FiMoreVertical />
          </button>
        </div>
      </div> 
   
    </motion.div>
  );
};

const MobileGridCard = ({
  ad,
  onView
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-white rounded-lg shadow-md overflow-hidden"
      onClick={() => onView(ad._id)}
    >
      <div className="relative h-40">
        <img
          src={
            ad.images?.length
              ? ad.images[0]
              : 'https://via.placeholder.com/300x200?text=Resim+Yok'
          }
          alt={ad.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2">
          <AdStatusBadge status={ad.status || 'active'} />
        </div>
      </div>
      <div className="p-3">
        <h3 className="font-medium text-gray-900 mb-1 truncate">{ad.title}</h3>
        <div className="flex items-center justify-between mb-2">
          <span className="text-blue-700 font-medium">
            {ad.price ? `${ad.price}₺` : 'Fiyat Belirtilmedi'}
          </span>
          <span className="text-xs text-gray-700">
            {ad.priceType || 'saatlik'}
          </span>
        </div>
       
      </div>
    </motion.div>
  );
};

const AllAds = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const {
    allAds, 
    userAdsStatus: status,
    error,
    statusChangeLoading,
  } = useSelector((state) => state.ads);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [adToDelete, setAdToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isMobile, setIsMobile] = useState(false);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');  
  const [sortOption, setSortOption] = useState('newest');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' }); 
  const [category, setCategory] = useState(null);  
  const [currentPage, setCurrentPage] = useState(1); 
  useEffect(() => {
    dispatch(fetchAllAds());
    const checkMobile = () => {
      const isMobileView = window.innerWidth < 768; 
      setIsMobile(isMobileView);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile); 
      
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, [dispatch]);
    

  const sendMailVerification = async () => {
    try {
      const response = await emailSend();
      if (response?.status === 'success') navigate('/emailverify');
      else if (response?.status === 'continue')
        navigate('/dashboard/my-ads/new');
    } catch (error) {
      console.error('Email verification failed:', error);
    }
  };

  const handleViewAd = (adId) => {
    navigate(`/dashboard/my-ads/${adId}`);
  };
 
  const handleSearch = (e) => {
    e.preventDefault();
  }; 
//  const filteredAdss = allAds
//         ?.filter((ad) =>
//           ad.title.toLowerCase().includes(searchTerm.toLowerCase())
//         )
//         ?.filter((ad) =>
//           selectedCity ? ad.city?.name === selectedCity : true
//         )
//         ?.filter((ad) =>
//           selectedCategory ? ad.category?.name === selectedCategory : true
//         )
//         ?.filter((ad) =>
//           selectedSubCategory ? ad.subCategory?.name === selectedSubCategory : true
//         )
//         ?.sort((a, b) => {
//           if (sortOption === 'newest') {
//             return new Date(b.createdAt) - new Date(a.createdAt);
//           } else if (sortOption === 'oldest') {
//             return new Date(a.createdAt) - new Date(b.createdAt);
//           }
//           return 0;
//         }); 
  const statusOptions = [
    { _id: 'all', name: 'Tümü' },
    { _id: 'active', name: 'Aktif İlanlar' },
    { _id: 'pending', name: 'Onay Bekleyenler' },
    { _id: 'pasif', name: 'Pasif İlanlar' },
  ];
  const categories =  Array.from(
    new Map(
      allAds
        ?.filter((data) => data.category && data.category._id)
        .map((data) => [data.category._id, data.category]) // key: _id, value: category
    ).values()
  );
  const subCategories =  Array.from(
    new Map(
      allAds
        ?.filter((data) => data.subCategory && data.subCategory._id)
        .map((data) => [data.subCategory._id, data.subCategory]) // key: _id, value: category
    ).values()
  );
  const activeFilters = [];
  if (selectedFilter !== 'all') {
    const statusName =
      statusOptions.find((s) => s._id === selectedFilter)?.name || 'Durum';
    activeFilters.push({ id: 'status', label: statusName });
  }
  if (searchTerm) {
    activeFilters.push({ id: 'search', label: `Arama: ${searchTerm}` });
  }
  const toggleViewMode = () => {
    const newMode = viewMode === 'grid' ? 'list' : 'grid';
    setViewMode(newMode);
  };
  const handleClearFilter = (filterId) => {
    if (filterId === 'status') {
      setSelectedFilter('all');
    } else if (filterId === 'search') {
      setSearchTerm('');
    }
  };

  const handleClearAllFilters = () => {
    setSelectedFilter('all');
    setSearchTerm('');
  };
  const handlePriceFilter = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };
  const handleSortChange = (option) => {
    if (option === 'newest') {
      setSortField('createdAt');
      setSortDirection('desc');
    } else if (option === 'price-low') {
      setSortField('price');
      setSortDirection('asc');
    } else if (option === 'price-high') {
      setSortField('price');
      setSortDirection('desc');
    }
  };

  const getCurrentSortOption = () => {
    if (sortField === 'createdAt' && sortDirection === 'desc') {
      return 'newest';
    } else if (sortField === 'price' && sortDirection === 'asc') {
      return 'price-low';
    } else if (sortField === 'price' && sortDirection === 'desc') {
      return 'price-high';
    }
    return 'newest';
  };
 

  const filteredAds = useMemo(() => { 
    
    let ads = Array.isArray(allAds?.data) ? allAds.data : allAds || [];
    let categoryId =
      selectedSubCategory === 'all' ? selectedCategory : selectedSubCategory;
      
    if (categoryId) {
      ads = ads.filter((ad) => ad.category?._id === categoryId);
    }else{
        categoryId='all'
    }
    if (searchTerm) {
      ads = ads.filter(
        (ad) =>
          ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (ad.description &&
            ad.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    if (priceRange?.min !== '' && priceRange?.max !== '') {
        ads = ads.filter(
          (ad) => ad.price >= Number(priceRange.min) && ad.price <= Number(priceRange.max)
        );
      } else if (priceRange?.min !== '') {
        ads = ads.filter((ad) => ad.price >= Number(priceRange.min));
      } else if (priceRange?.max !== '') {
        ads = ads.filter((ad) => ad.price <= Number(priceRange.max));
      }
    if (selectedFilter !== 'all') {
      ads = ads.filter((ad) => ad.status === selectedFilter);
    }
    return [...ads].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === 'price') {
        aValue = Number.parseFloat(aValue) || 0;
        bValue = Number.parseFloat(bValue) || 0;
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [allAds, searchTerm, selectedFilter, sortField, sortDirection,selectedCategory, selectedSubCategory,priceRange]);

  if (status === 'loading') {
    return <LoadingState />;
  }

  if (status === 'failed') {
    return <ErrorState error={error} />;
  }

  if (
    !allAds ||
    (Array.isArray(allAds?.data) ? allAds.data.length === 0 : !allAds.length)
  ) {
    return (
      <>
        <MetaHelmet
          title="İlanlar"
          description="Yayınladığınız ilanları görüntüleyin ve iletişime geçin."
          keywords="ilanlar, hizmet ilanları, ilan detayları"
          canonical={`${window.location.origin}/dashboard/my-ads`}
        /> 
      </>
    );
  }

  return (
    <div className="p-3 md:p-8 bg-gray-50 min-h-screen">
      <MetaHelmet
          title="İlanlar"
          description="Yayınladığınız ilanları görüntüleyin ve iletişime geçin."
          keywords="ilanlar, hizmet ilanları, ilan detayları"
          canonical={`${window.location.origin}/dashboard/my-ads`}
        /> 
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-md rounded-xl overflow-hidden mb-8"
      >
        <div className="flex flex-col md:flex-row justify-between items-center p-4 md:p-6 border-b border-gray-200">
          <h2 className="text-xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-0 flex items-center">
            <span className="bg-blue-100 text-blue-800 p-2 rounded-lg mr-3">
              <FiGrid className="text-xl" />
            </span>
            İlanlar
            <span className="ml-3 text-sm font-normal text-gray-700 bg-gray-200 px-2 py-1 rounded-full">
              {filteredAds.length} ilan
            </span>
          </h2>
          <button
            onClick={sendMailVerification}
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 md:px-6 md:py-3 rounded-lg transition duration-300 ease-in-out flex items-center justify-center"
          >
            <FiPlus className="mr-2" />
            Yeni İlan Ekle
          </button>
        </div>

        <div className="p-3 md:p-4 border-b border-gray-200 bg-gray-50"> 
          <Filter
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onSearchSubmit={handleSearch}
              searchPlaceholder="İlan ara..."
              viewMode={viewMode}
              onViewModeChange={toggleViewMode}
              sortOption={getCurrentSortOption}
              onSortChange={handleSortChange}
              sortOptions={[
                { id: 'newest', label: 'En Yeni' },
                { id: 'price-low', label: 'Fiyat (Düşükten Yükseğe)' },
                { id: 'price-high', label: 'Fiyat (Yüksekten Düşüğe)' },
              ]}
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
              onPriceFilterSubmit={handlePriceFilter}
              subCategories={subCategories}
              categories={categories}
              isSubCategories={false}
              selectedCategory={setSelectedCategory}
              onCategoryChange={setSelectedSubCategory}
              categoryAllLabel={`Tüm ${subCategories?.name || 'Kategoriler'}`} 
              onClearFilter={handleClearFilter}
              onClearAllFilters={handleClearAllFilters}
              layout="expanded"
            />
        </div>

        {filteredAds.length === 0 ? (
          <div className="p-8 md:p-12 text-center">
            <FiSearch className="mx-auto text-4xl text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">
              Sonuç bulunamadı
            </h3>
            <p className="mt-1 text-gray-500">
              Arama kriterlerinize uygun ilan bulunamadı.
            </p>
          </div>
        ) : isMobile ? (
          viewMode === 'grid' ? (
            <div className="p-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <AnimatePresence>
                  {filteredAds.map((ad) => (
                    <MobileGridCard
                      key={ad._id}
                      ad={ad}
                      onView={handleViewAd} 
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <div className="p-3">
              <AnimatePresence>
                {filteredAds.map((ad) => (
                  <MobileListCard
                    key={ad._id}
                    ad={ad}
                    onView={handleViewAd}  
                  />
                ))}
              </AnimatePresence>
            </div>
          )
        ) : viewMode === 'grid' ? (
          <div className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence>
                {filteredAds.map((ad) => (
                  <AdCard
                    key={ad._id}
                    ad={ad}
                    onView={handleViewAd} 
                    isLoading={statusChangeLoading}
                    isManageable={false}
                    
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Resim
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    <button
                      onClick={() => {
                        setSortField('title');
                        setSortDirection(
                          sortDirection === 'asc' ? 'desc' : 'asc'
                        );
                      }}
                      className="flex items-center focus:outline-none"
                    >
                      Başlık
                      {sortField === 'title' && (
                        <span className="ml-1">
                          {sortDirection === 'asc' ? (
                            <FaSortAmountUp className="text-gray-400" />
                          ) : (
                            <FaSortAmountDown className="text-gray-400" />
                          )}
                        </span>
                      )}
                    </button>
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    <button
                      onClick={() => {
                        setSortField('price');
                        setSortDirection(
                          sortDirection === 'asc' ? 'desc' : 'asc'
                        );
                      }}
                      className="flex items-center focus:outline-none"
                    >
                      Fiyat
                      {sortField === 'price' && (
                        <span className="ml-1">
                          {sortDirection === 'asc' ? (
                            <FaSortAmountUp className="text-gray-400" />
                          ) : (
                            <FaSortAmountDown className="text-gray-400" />
                          )}
                        </span>
                      )}
                    </button>
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Konum
                  </th>
                  <th className="py-3 px-4 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                    
                  </th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredAds.map((ad) => (
                    <motion.tr
                      key={ad._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-gray-50 transition duration-150 ease-in-out cursor-pointer"
                      onClick={() => handleViewAd(ad._id)}
                    >
                      <td className="py-4 px-4">
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-md overflow-hidden shadow-sm">
                          <img
                            src={
                              ad.images?.length
                                ? ad.images[0]
                                : 'https://via.placeholder.com/300x200?text=Resim+Yok'
                            }
                            alt={ad.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm md:text-base font-medium text-gray-900">
                          {ad.title}
                        </div>
                        <div className="text-xs text-gray-700 line-clamp-1">
                          {ad.description || 'Açıklama bulunmuyor'}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm md:text-base font-medium text-blue-700">
                        {ad.price ? `${ad.price}₺` : 'Fiyat Belirtilmedi'}
                        <div className="text-xs text-gray-700">
                          {ad.priceType || 'saatlik'}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                       {ad?.city?.name}
                      </td>
                      <td
                        className="py-4 px-4 text-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                       
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
 
    </div>
  );
};

export default AllAds;

















// import { useEffect, useState } from 'react';
// import MetaHelmet from '../../utils/MetaHelmet';
// import { getAllAdsRequest } from '../../api/adsApi';
// import { FiFilter, FiSliders, FiSearch, FiX } from 'react-icons/fi';
// const AllAds = () => {
//   const [allAds, setAllAds] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedCity, setSelectedCity] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('');
//   const [selectedSubCategory, setSelectedSubCategory] = useState('');
//   const [minPrice, setMinPrice] = useState('');
//   const [maxPrice, setMaxPrice] = useState('');
//   const [sortOption, setSortOption] = useState('newest');
//   const [loading, setLoading] = useState(true);
//   const [isFilterOpen, setIsFilterOpen] = useState(false);

//   // Toggle the filter panel

//   const AllAdss = async () => {
//     try {
//       setLoading(true);
//       const AllAdData = await getAllAdsRequest();
//       setAllAds(AllAdData);
//     } catch (error) {
//       console.error("İlanlar alınırken bir hata oluştu:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     AllAdss();
//   }, []);

//   const filteredAds = loading
//     ? []
//     : allAds?.data
//         ?.filter((ad) =>
//           ad.title.toLowerCase().includes(searchTerm.toLowerCase())
//         )
//         ?.filter((ad) =>
//           selectedCity ? ad.city?.name === selectedCity : true
//         )
//         ?.filter((ad) =>
//           selectedCategory ? ad.category?.name === selectedCategory : true
//         )
//         ?.filter((ad) =>
//           selectedSubCategory ? ad.subCategory?.name === selectedSubCategory : true
//         )
//         ?.filter((ad) =>
//           minPrice && maxPrice
//             ? ad.price >= minPrice && ad.price <= maxPrice
//             : minPrice
//             ? ad.price >= minPrice
//             : maxPrice
//             ? ad.price <= maxPrice
//             : true
//         )
//         ?.sort((a, b) => {
//           if (sortOption === 'newest') {
//             return new Date(b.createdAt) - new Date(a.createdAt);
//           } else if (sortOption === 'oldest') {
//             return new Date(a.createdAt) - new Date(b.createdAt);
//           }
//           return 0;
//         });

//   const uniqueCities = loading
//     ? []
//     : [
//         ...new Set(allAds?.data?.map((ad) => ad.city?.name)),
//       ];
//   const uniqueCategories = loading
//     ? []
//     : [
//         ...new Set(allAds?.data?.map((ad) => ad.category?.name)),
//       ];
//   const uniqueSubCategories = loading
//     ? []
//     : [
//         ...new Set(allAds?.data?.map((ad) => ad.subCategory?.name)),
//       ]; 
//       const [isSortOpen, setIsSortOpen] = useState(false);
    
//       const toggleFilter = () => setIsFilterOpen(!isFilterOpen);
//   // Toggle sort popup visibility
//   const toggleSort = () => setIsSortOpen(!isSortOpen);

//   // Active sort button style
//   const activeSortStyle = 'bg-blue-500 text-white border-blue-500';
//   const inactiveSortStyle = 'bg-white text-gray-800 border-gray-300';
//   return (
//     <div className="bg-white min-h-screen">
//  <div className="w-full border-b bg-gray-100 py-4">
//       <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
//         {/* Search Input */}
//         <input
//           type="text"
//           placeholder="İlan başlığı ara..."
//           className="px-4 py-2 rounded-lg shadow-sm border border-gray-300 w-full md:w-1/3"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />

//         {/* Filter Button */}
//         <button
//           onClick={toggleFilter}
//           className="px-4 py-2 rounded-lg shadow-sm border border-gray-300 bg-blue-500 text-white w-full md:w-auto"
//         >
//           Filtrele
//         </button>

//         {/* Sort Button */}
//         <button
//           onClick={toggleSort}
//           className="px-4 py-2 rounded-lg shadow-sm border border-gray-300 bg-green-500 text-white w-full md:w-auto"
//         >
//           Sırala
//         </button>
//       </div>

//       {/* Filter Popup - Appears below the filter button */}
//       {isFilterOpen && (
//         <div className="absolute right-0 w-[200px] mt-4 md:mt-6 bg-white p-4 rounded-lg shadow-md flex flex-col gap-4 z-10">
//           <h3 className="font-semibold text-gray-800">Filtrele</h3>
          
//           {/* City Select */}
//           <select
//             className="w-full px-4 py-2 rounded-lg shadow-sm border border-gray-300"
//             value={selectedCity}
//             onChange={(e) => setSelectedCity(e.target.value)}
//           >
//             <option value="">Tüm şehirler</option>
//             {uniqueCities.map((city, index) => (
//               <option key={index} value={city}>
//                 {city}
//               </option>
//             ))}
//           </select>

        //   {/* Category Select */}
        //   <select
        //     className="w-full px-4 py-2 rounded-lg shadow-sm border border-gray-300"
        //     value={selectedCategory}
        //     onChange={(e) => setSelectedCategory(e.target.value)}
        //   >
        //     <option value="">Tüm Kategoriler</option>
        //     {uniqueCategories.map((category, index) => (
        //       <option key={index} value={category}>
        //         {category}
        //       </option>
        //     ))}
        //   </select>

//           {/* SubCategory Select */}
//           <select
//             className="w-full px-4 py-2 rounded-lg shadow-sm border border-gray-300"
//             value={selectedSubCategory}
//             onChange={(e) => setSelectedSubCategory(e.target.value)}
//           >
//             <option value="">Tüm Alt Kategoriler</option>
//             {uniqueSubCategories.map((subCategory, index) => (
//               <option key={index} value={subCategory}>
//                 {subCategory}
//               </option>
//             ))}
//           </select>

//           {/* Min Price Input */}
//           <input
//             type="number"
//             placeholder="Min Fiyat"
//             className="w-full px-4 py-2 rounded-lg shadow-sm border border-gray-300"
//             value={minPrice}
//             onChange={(e) => setMinPrice(e.target.value)}
//           />

//           {/* Max Price Input */}
//           <input
//             type="number"
//             placeholder="Max Fiyat"
//             className="w-full px-4 py-2 rounded-lg shadow-sm border border-gray-300"
//             value={maxPrice}
//             onChange={(e) => setMaxPrice(e.target.value)}
//           />
//         </div>
//       )}

//       {/* Sort Popup - Appears below the sort button */}
//       {isSortOpen && (
//         <div className="absolute right-0 w-[200px] mt-4 md:mt-6 bg-white p-4 rounded-lg shadow-md flex flex-col gap-4 z-10">
//           <h3 className="font-semibold text-gray-800">Sıralama</h3>

//           {/* Sort Option Select */}
//           <select
//             className="w-full px-4 py-2 rounded-lg shadow-sm border border-gray-300"
//             value={sortOption}
//             onChange={(e) => setSortOption(e.target.value)}
//           >
//             <option value="newest">En yeni</option>
//             <option value="oldest">En eski</option>
//             <option value="price-asc">Fiyat Artan</option>
//             <option value="price-desc">Fiyat Azalan</option>
//           </select>
//         </div>
//       )}
//     </div>


//       <div className="max-w-7xl mx-auto px-4 py-8">
//         {loading ? (
//           <div className="text-center text-gray-600">Yükleniyor...</div>
//         ) : filteredAds?.length > 0 ? (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//             {filteredAds.map((ad, key) => (
//               <a
//                 href={`allAds/${ad._id}`}
//                 key={key}
//                 className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
//               >
//                 <div className="relative h-48 overflow-hidden">
//                   <img
//                     src={ad.images[0]}
//                     alt={ad.title}
//                     className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
//                   />
//                 </div>
//                 <div className="p-5">
//                   <h3 className="font-bold text-lg text-gray-900 line-clamp-1 mb-2">
//                     {ad.title}
//                   </h3>
//                   <p className="text-gray-700 text-sm line-clamp-2 mb-3">
//                     {ad.description}
//                   </p>
//                 </div>
//                 <div className="border-t border-gray-100 p-4 bg-gray-50">
//                   <div className="flex justify-between text-xs text-gray-700">
//                     <div className="flex items-center">
//                       <svg
//                         className="mr-1"
//                         height="1em"
//                         width="1em"
//                         fill="none"
//                         stroke="currentColor"
//                         strokeWidth="2"
//                         viewBox="0 0 24 24"
//                       >
//                         <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
//                         <circle cx="12" cy="10" r="3"></circle>
//                       </svg>
//                       {ad.city?.name || 'Şehir Bilgisi Yok'}
//                     </div>
//                     <div className="flex items-center">
//                       <svg
//                         className="mr-1"
//                         height="1em"
//                         width="1em"
//                         fill="none"
//                         stroke="currentColor"
//                         strokeWidth="2"
//                         viewBox="0 0 24 24"
//                       >
//                         <circle cx="12" cy="12" r="10"></circle>
//                         <polyline points="12 6 12 12 16 14"></polyline>
//                       </svg>
//                       {ad.price}₺
//                     </div>
//                   </div>
//                 </div>
//               </a>
//             ))}
//           </div>
//         ) : (
//           <div className="text-center text-gray-600">Hiç ilan yok.</div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AllAds;
