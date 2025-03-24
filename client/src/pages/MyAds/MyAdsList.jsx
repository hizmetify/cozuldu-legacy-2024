import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  fetchUserAds,
  deleteAd,
  changeAdStatus,
} from '../../features/ad/adSlice';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import { FaRegTrashCan } from 'react-icons/fa6';
import {
  FaEdit,
  FaEye,
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
import DeleteConfirmationModal from '../../components/UI/DeleteConfirmationModal';
import { emailSend } from '../../api/authApi';
import { motion, AnimatePresence } from 'framer-motion';
import AdCard from '../../components/MyAds/AdCard';
import Filter from '../../components/UI/Filter';
import MetaHelmet from '../../utils/MetaHelmet';

const EmptyState = ({ onAddNew }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-center p-6 md:p-12 bg-white shadow-md rounded-lg"
  >
    <div className="mx-auto w-20 h-20 md:w-24 md:h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6">
      <FiPlus className="text-blue-700 text-2xl md:text-3xl" />
    </div>
    <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
      Henüz bir ilanınız yok
    </h3>
    <p className="text-gray-700 mb-6 max-w-md mx-auto">
      İlk ilanınızı ekleyerek hizmetlerinizi potansiyel müşterilerinize
      göstermeye başlayın.
    </p>
    <button
      onClick={onAddNew}
      className="inline-flex items-center px-5 py-2.5 md:px-6 md:py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
    >
      <FiPlus className="mr-2" />
      Yeni İlan Ekle
    </button>
  </motion.div>
);

const LoadingState = () => <LoadingSpinner message="İlanlarınız Yükleniyor" />;

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
  onView,
  onEdit,
  onDelete,
  changeStatus,
  statusChangeLoading,
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

      {showActions && (
        <div
          className="border-t border-gray-100 bg-gray-50 p-2"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="grid grid-cols-3 gap-1">
            <button
              onClick={() => onView(ad._id)}
              className="flex flex-col items-center justify-center py-2 px-1 rounded-md hover:bg-gray-100"
            >
              <FaEye className="text-blue-700 mb-1" />
              <span className="text-xs text-gray-700">Görüntüle</span>
            </button>
            <button
              onClick={() => onEdit(ad._id)}
              className="flex flex-col items-center justify-center py-2 px-1 rounded-md hover:bg-gray-100"
            >
              <FaEdit className="text-green-700 mb-1" />
              <span className="text-xs text-gray-700">Düzenle</span>
            </button>
            <button
              onClick={() => onDelete(ad._id)}
              className="flex flex-col items-center justify-center py-2 px-1 rounded-md hover:bg-gray-100"
            >
              <FaRegTrashCan className="text-red-700 mb-1" />
              <span className="text-xs text-gray-700">Sil</span>
            </button>
          </div>
          <button
            onClick={() => changeStatus(ad._id, ad.status)}
            disabled={statusChangeLoading}
            className={`w-full mt-2 py-2 rounded-md flex items-center justify-center gap-2 text-sm font-medium transition-all duration-200 ${
              statusChangeLoading
                ? 'bg-gray-100 text-gray-700 cursor-not-allowed'
                : ad.status === 'active'
                ? 'bg-red-100 text-red-800 hover:bg-red-200 border border-red-200'
                : 'bg-green-100 text-green-800 hover:bg-green-200 border border-green-200'
            }`}
          >
            {statusChangeLoading ? (
              <span>İşleniyor...</span>
            ) : ad.status === 'active' ? (
              <>
                <FiEyeOff className="h-4 w-4" />
                <span>Yayından Kaldır</span>
              </>
            ) : (
              <>
                <FiEye className="h-4 w-4" />
                <span>Yayınla</span>
              </>
            )}
          </button>
        </div>
      )}
    </motion.div>
  );
};

const MobileGridCard = ({
  ad,
  onView,
  onEdit,
  onDelete,
  changeStatus,
  statusChangeLoading,
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
        <div
          className="grid grid-cols-3 gap-1 mt-2"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onView(ad._id);
            }}
            className="flex flex-col items-center justify-center py-1.5 px-1 rounded-md hover:bg-gray-100"
          >
            <FaEye className="text-blue-700 mb-0.5 text-sm" />
            <span className="text-xs text-gray-700">Görüntüle</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(ad._id);
            }}
            className="flex flex-col items-center justify-center py-1.5 px-1 rounded-md hover:bg-gray-100"
          >
            <FaEdit className="text-green-700 mb-0.5 text-sm" />
            <span className="text-xs text-gray-700">Düzenle</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(ad._id);
            }}
            className="flex flex-col items-center justify-center py-1.5 px-1 rounded-md hover:bg-gray-100"
          >
            <FaRegTrashCan className="text-red-700 mb-0.5 text-sm" />
            <span className="text-xs text-gray-700">Sil</span>
          </button>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            changeStatus(ad._id, ad.status);
          }}
          disabled={statusChangeLoading}
          className={`w-full mt-2 py-1.5 rounded-md flex items-center justify-center gap-1 text-xs font-medium transition-all duration-200 ${
            statusChangeLoading
              ? 'bg-gray-100 text-gray-700 cursor-not-allowed'
              : ad.status === 'active'
              ? 'bg-red-100 text-red-800 hover:bg-red-200 border border-red-200'
              : 'bg-green-100 text-green-800 hover:bg-green-200 border border-green-200'
          }`}
        >
          {statusChangeLoading ? (
            <span>İşleniyor...</span>
          ) : ad.status === 'active' ? (
            <>
              <FiEyeOff className="h-3 w-3" />
              <span>Yayından Kaldır</span>
            </>
          ) : (
            <>
              <FiEye className="h-3 w-3" />
              <span>Yayınla</span>
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};

const MyAdsList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    userAds,
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

  useEffect(() => {
    dispatch(fetchUserAds());
    const checkMobile = () => {
      const isMobileView = window.innerWidth < 768;
      console.log(
        'Ekran genişliği:',
        window.innerWidth,
        'Mobil mi:',
        isMobileView
      );
      setIsMobile(isMobileView);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, [dispatch]);

  const handleDeleteClick = (adId) => {
    setAdToDelete(adId);
    setIsDeleteModalOpen(true);
  };

  const handleChangeStatus = async (adId, adStatus) => {
    const newStatus = adStatus === 'active' ? 'pasif' : 'active';
    try {
      await dispatch(changeAdStatus({ adId, adData: newStatus })).unwrap();
    } catch (error) {
      console.error('Durum değişikliği hatası:', error);
    }
  };

  const handleConfirmDelete = async () => {
    if (adToDelete) {
      try {
        await dispatch(deleteAd(adToDelete)).unwrap();
        // add success toast
      } catch (error) {
        // add error toast
      } finally {
        setIsDeleteModalOpen(false);
        setAdToDelete(null);
      }
    }
  };

  const handleCloseModal = () => {
    setIsDeleteModalOpen(false);
    setAdToDelete(null);
  };

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

  const handleEditAd = (adId) => {
    navigate(`/dashboard/my-ads/${adId}/edit`);
  };

  const handleSearch = (e) => {
    e.preventDefault();
  };

  const statusOptions = [
    { _id: 'all', name: 'Tümü' },
    { _id: 'active', name: 'Aktif İlanlar' },
    { _id: 'pending', name: 'Onay Bekleyenler' },
    { _id: 'pasif', name: 'Pasif İlanlar' },
  ];

  const activeFilters = [];
  if (selectedFilter !== 'all') {
    const statusName =
      statusOptions.find((s) => s._id === selectedFilter)?.name || 'Durum';
    activeFilters.push({ id: 'status', label: statusName });
  }
  if (searchTerm) {
    activeFilters.push({ id: 'search', label: `Arama: ${searchTerm}` });
  }

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

  const toggleViewMode = () => {
    console.log('Görünüm modu değişiyor. Şu anki mod:', viewMode);
    const newMode = viewMode === 'grid' ? 'list' : 'grid';
    setViewMode(newMode);
    console.log('Yeni görünüm modu:', newMode);
  };

  const filteredAds = useMemo(() => {
    let ads = Array.isArray(userAds?.data) ? userAds.data : userAds || [];
    if (searchTerm) {
      ads = ads.filter(
        (ad) =>
          ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (ad.description &&
            ad.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
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
  }, [userAds, searchTerm, selectedFilter, sortField, sortDirection]);

  if (status === 'loading') {
    return <LoadingState />;
  }

  if (status === 'failed') {
    return <ErrorState error={error} />;
  }

  if (
    !userAds ||
    (Array.isArray(userAds?.data) ? userAds.data.length === 0 : !userAds.length)
  ) {
    return (
      <>
        <MetaHelmet
          title="İlanlarım"
          description="Yayınladığınız ilanları görüntüleyin, düzenleyin ve yönetin."
          keywords="ilanlarım, hizmet ilanları, ilan yönetimi"
          canonical={`${window.location.origin}/dashboard/my-ads`}
        />
        <EmptyState onAddNew={sendMailVerification} />
      </>
    );
  }

  return (
    <div className="p-3 md:p-8 bg-gray-50 min-h-screen">
      <MetaHelmet
        title="İlanlarım"
        description="Yayınladığınız ilanları görüntüleyin, düzenleyin ve yönetin."
        keywords="ilanlarım, hizmet ilanları, ilan yönetimi"
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
            İlanlarım
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
            sortOption={getCurrentSortOption()}
            onSortChange={handleSortChange}
            sortOptions={[
              { id: 'newest', label: 'En Yeni' },
              { id: 'price-low', label: 'Fiyat (Düşükten Yükseğe)' },
              { id: 'price-high', label: 'Fiyat (Yüksekten Düşüğe)' },
            ]}
            showFilters={true}
            categories={statusOptions}
            selectedCategory={selectedFilter}
            onCategoryChange={setSelectedFilter}
            categoryAllLabel="Tümü"
            activeFilters={activeFilters}
            onClearFilter={handleClearFilter}
            onClearAllFilters={handleClearAllFilters}
            layout="compact"
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
                      onEdit={handleEditAd}
                      onDelete={handleDeleteClick}
                      changeStatus={handleChangeStatus}
                      statusChangeLoading={statusChangeLoading}
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
                    onEdit={handleEditAd}
                    onDelete={handleDeleteClick}
                    changeStatus={handleChangeStatus}
                    statusChangeLoading={statusChangeLoading}
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
                    onEdit={handleEditAd}
                    onDelete={handleDeleteClick}
                    changeStatus={handleChangeStatus}
                    isLoading={statusChangeLoading}
                    isManageable={true}
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
                    Durum
                  </th>
                  <th className="py-3 px-4 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                    İşlemler
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
                        <AdStatusBadge status={ad.status || 'active'} />
                      </td>
                      <td
                        className="py-4 px-4 text-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => handleViewAd(ad._id)}
                            className="p-2 text-blue-700 hover:text-blue-800 hover:bg-blue-50 rounded-full transition duration-150 ease-in-out"
                            title="Görüntüle"
                          >
                            <FaEye className="text-lg" />
                          </button>
                          <button
                            onClick={() => handleEditAd(ad._id)}
                            className="p-2 text-green-700 hover:text-green-800 hover:bg-green-50 rounded-full transition duration-150 ease-in-out"
                            title="Düzenle"
                          >
                            <FaEdit className="text-lg" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(ad._id)}
                            className="p-2 text-red-700 hover:text-red-800 hover:bg-red-50 rounded-full transition duration-150 ease-in-out"
                            title="Sil"
                          >
                            <FaRegTrashCan className="text-lg" />
                          </button>
                        </div>
                        <div className="mt-2">
                          <button
                            onClick={() =>
                              handleChangeStatus(ad._id, ad.status)
                            }
                            disabled={statusChangeLoading}
                            className={`w-full py-1.5 px-3 rounded text-xs font-medium transition-all duration-200 ${
                              statusChangeLoading
                                ? 'bg-gray-100 text-gray-700 cursor-not-allowed'
                                : ad.status === 'active'
                                ? 'bg-red-100 text-red-800 hover:bg-red-200 border border-red-200'
                                : 'bg-green-100 text-green-800 hover:bg-green-200 border border-green-200'
                            }`}
                          >
                            {statusChangeLoading ? (
                              <span>İşleniyor...</span>
                            ) : ad.status === 'active' ? (
                              <>
                                <FiEyeOff className="inline-block h-3 w-3 mr-1" />
                                <span>Yayından Kaldır</span>
                              </>
                            ) : (
                              <>
                                <FiEye className="inline-block h-3 w-3 mr-1" />
                                <span>Yayınla</span>
                              </>
                            )}
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        title="Bu ilanı silmek istediğinize emin misiniz?"
      />
    </div>
  );
};

export default MyAdsList;
