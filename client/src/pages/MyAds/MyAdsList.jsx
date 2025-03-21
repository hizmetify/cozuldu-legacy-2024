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
import { FaEdit, FaEye, FaSearch, FaFilter } from 'react-icons/fa';
import { FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';
import {
  FiPlus,
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiGrid,
  FiList,
  FiSearch as FiSearchIcon,
  FiEye,
  FiEyeOff,
  FiXCircle,
} from 'react-icons/fi';
import DeleteConfirmationModal from '../../components/UI/DeleteConfirmationModal';
import { emailSend } from '../../api/authApi';
import { motion, AnimatePresence } from 'framer-motion';

const AdStatusBadge = ({ status }) => {
  const statusConfig = {
    active: {
      color: 'bg-green-100 text-green-800',
      icon: <FiCheckCircle className="mr-1" />,
    },
    pending: {
      color: 'bg-yellow-100 text-yellow-800',
      icon: <FiClock className="mr-1" />,
    },
    pasif: {
      color: 'bg-red-100 text-red-800',
      icon: <FiXCircle className="mr-1" />,
    },
  };

  const config = statusConfig[status] || statusConfig.active;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
    >
      {config.icon}
      {status === 'active'
        ? 'Aktif'
        : status === 'pending'
        ? 'Onay Bekliyor'
        : 'Pasif'}
    </span>
  );
};
const AdCard = ({ ad, onView, onEdit, onDelete, changeStatus, isLoading }) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
    transition={{ duration: 0.2 }}
    className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
    onClick={() => onView(ad._id)}
  >
    <div className="relative h-48 overflow-hidden">
      <img
        src={
          ad.images?.length
            ? ad.images[0]
            : 'https://media.istockphoto.com/id/1324356458/tr/vekt%C3%B6r/picture-icon-photo-frame-symbol-landscape-sign-photograph-gallery-logo-web-interface-and.jpg?s=612x612&w=0&k=20&c=khO1-2i1TZ67Nak9JQWmDx7Slai72lbl6SEp2gDOaV8='
        }
        alt={ad.title}
        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
      />
      <div className="absolute top-2 right-2">
        <AdStatusBadge status={ad.status} />
      </div>
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
          {ad.price ? `${ad.price}₺` : 'Fiyat Belirtilmedi'}
        </span>
        <span className="text-xs text-gray-500">
          {ad.priceType || 'saatlik'}
        </span>
      </div>
    </div>
    <div
      className="border-t border-gray-100 p-4 bg-gray-50"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex justify-between">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onView(ad._id);
          }}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
          title="Görüntüle"
        >
          <FaEye />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(ad._id);
          }}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
          title="Düzenle"
        >
          <FaEdit />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(ad._id);
          }}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
          title="Sil"
        >
          <FaRegTrashCan />
        </button>
      </div>
    </div>

    <div className="px-4 pb-4 pt-1" onClick={(e) => e.stopPropagation()}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          changeStatus(ad._id, ad.status);
        }}
        disabled={isLoading}
        className={`w-full py-2.5 rounded-md flex items-center justify-center gap-2 text-sm font-medium transition-all duration-200 ${
          isLoading
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : ad.status === 'active'
            ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 hover:border-red-300 hover:shadow-md'
            : 'bg-green-50 text-green-600 hover:bg-green-100 border border-green-200 hover:border-green-300 hover:shadow-md'
        }`}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>İşleniyor...</span>
          </>
        ) : ad.status === 'active' ? (
          <>
            <FiEyeOff className="h-4 w-4" />
            <span className="font-medium">Yayından Kaldır</span>
          </>
        ) : (
          <>
            <FiEye className="h-4 w-4" />
            <span className="font-medium">Yayınla</span>
          </>
        )}
      </button>
    </div>
  </motion.div>
);

const EmptyState = ({ onAddNew }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-center p-12 bg-white shadow-md rounded-lg"
  >
    <div className="mx-auto w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6">
      <FiPlus className="text-blue-600 text-3xl" />
    </div>
    <h3 className="text-xl font-semibold text-gray-800 mb-2">
      Henüz bir ilanınız yok
    </h3>
    <p className="text-gray-600 mb-6 max-w-md mx-auto">
      İlk ilanınızı ekleyerek hizmetlerinizi potansiyel müşterilerinize
      göstermeye başlayın.
    </p>
    <button
      onClick={onAddNew}
      className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
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
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchUserAds());
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
        // Add success toast
      } catch (error) {
        // Add error toast
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

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === 'grid' ? 'list' : 'grid');
  };

  const toggleFilterMenu = () => {
    setIsFilterMenuOpen(!isFilterMenuOpen);
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
    return <EmptyState onAddNew={sendMailVerification} />;
  }

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-md rounded-xl overflow-hidden mb-8"
      >
        <div className="flex flex-col md:flex-row justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-0 flex items-center">
            <span className="bg-blue-100 text-blue-800 p-2 rounded-lg mr-3">
              <FiGrid className="text-xl" />
            </span>
            İlanlarım
            <span className="ml-3 text-sm font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {filteredAds.length} ilan
            </span>
          </h2>
          <button
            onClick={sendMailVerification}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg flex items-center"
          >
            <FiPlus className="mr-2" />
            Yeni İlan Ekle
          </button>
        </div>

        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="İlan ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex gap-2">
              <div className="relative">
                <button
                  onClick={toggleFilterMenu}
                  className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50"
                >
                  <FaFilter className="mr-2 text-gray-500" />
                  <span>Filtrele</span>
                </button>

                {isFilterMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setSelectedFilter('all');
                          setIsFilterMenuOpen(false);
                        }}
                        className={`block px-4 py-2 text-sm w-full text-left ${
                          selectedFilter === 'all'
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-gray-700'
                        }`}
                      >
                        Tümü
                      </button>
                      <button
                        onClick={() => {
                          setSelectedFilter('active');
                          setIsFilterMenuOpen(false);
                        }}
                        className={`block px-4 py-2 text-sm w-full text-left ${
                          selectedFilter === 'active'
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-gray-700'
                        }`}
                      >
                        Aktif İlanlar
                      </button>
                      <button
                        onClick={() => {
                          setSelectedFilter('pending');
                          setIsFilterMenuOpen(false);
                        }}
                        className={`block px-4 py-2 text-sm w-full text-left ${
                          selectedFilter === 'pending'
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-gray-700'
                        }`}
                      >
                        Onay Bekleyenler
                      </button>
                      <button
                        onClick={() => {
                          setSelectedFilter('pasif');
                          setIsFilterMenuOpen(false);
                        }}
                        className={`block px-4 py-2 text-sm w-full text-left ${
                          selectedFilter === 'pasif'
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-gray-700'
                        }`}
                      >
                        Pasif İlanlar
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => toggleSort('price')}
                className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50"
              >
                {sortDirection === 'asc' ? (
                  <FaSortAmountUp className="mr-2 text-gray-500" />
                ) : (
                  <FaSortAmountDown className="mr-2 text-gray-500" />
                )}
                <span>Fiyat</span>
              </button>

              <button
                onClick={toggleViewMode}
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
        </div>

        {filteredAds.length === 0 ? (
          <div className="p-12 text-center">
            <FiSearchIcon className="mx-auto text-4xl text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">
              Sonuç bulunamadı
            </h3>
            <p className="mt-1 text-gray-500">
              Arama kriterlerinize uygun ilan bulunamadı.
            </p>
          </div>
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
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Resim
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => toggleSort('title')}
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
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => toggleSort('price')}
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
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                                : 'https://media.istockphoto.com/id/1324356458/tr/vekt%C3%B6r/picture-icon-photo-frame-symbol-landscape-sign-photograph-gallery-logo-web-interface-and.jpg?s=612x612&w=0&k=20&c=khO1-2i1TZ67Nak9JQWmDx7Slai72lbl6SEp2gDOaV8='
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
                        <div className="text-xs text-gray-500 line-clamp-1">
                          {ad.description || 'Açıklama bulunmuyor'}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm md:text-base font-medium text-blue-600">
                        {ad.price ? `${ad.price}₺` : 'Fiyat Belirtilmedi'}
                        <div className="text-xs text-gray-500">
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
                            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition duration-150 ease-in-out"
                            title="Görüntüle"
                          >
                            <FaEye className="text-lg" />
                          </button>
                          <button
                            onClick={() => handleEditAd(ad._id)}
                            className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-full transition duration-150 ease-in-out"
                            title="Düzenle"
                          >
                            <FaEdit className="text-lg" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(ad._id)}
                            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full transition duration-150 ease-in-out"
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
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : ad.status === 'active'
                                ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                                : 'bg-green-50 text-green-600 hover:bg-green-100 border border-green-200'
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
