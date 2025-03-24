import { useEffect, useState } from 'react';
import { favoriAction, favoriGet } from '../../api/userApi';
import { Link } from 'react-router-dom';
import {
  FaEye,
  FaHeart,
  FaSearch,
  FaTimes,
  FaFilter,
  FaChevronDown,
  FaChevronUp,
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingSpinner from '../../components/UI/LoadingSpinner';

const Favorites = () => {
  const [ilanlar, setIlanlar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [activeFilter, setActiveFilter] = useState(null);
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const favoriActions = async (adId) => {
    try {
      await favoriAction(adId);
      fetchIlanlar();
    } catch (err) {
      console.error('Favori işlemi sırasında hata:', err);
    }
  };

  const fetchIlanlar = async () => {
    try {
      const response = await favoriGet();
      setIlanlar(response.data);
    } catch (err) {
      setError('Veriler alınırken hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIlanlar();
  }, []);

  const handleSort = (field) => {
    setActiveFilter(field);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const sortedIlanlar = [...ilanlar].sort((a, b) => {
    if (!activeFilter) return 0;

    let valueA, valueB;

    if (activeFilter === 'title') {
      valueA = a?.adId?.title?.toLowerCase() || '';
      valueB = b?.adId?.title?.toLowerCase() || '';
    } else if (activeFilter === 'price') {
      valueA = Number.parseFloat(a?.adId?.price) || 0;
      valueB = Number.parseFloat(b?.adId?.price) || 0;
    } else if (activeFilter === 'category') {
      valueA = a?.adId?.category?.name?.toLowerCase() || '';
      valueB = b?.adId?.category?.name?.toLowerCase() || '';
    }

    if (sortOrder === 'asc') {
      return valueA > valueB ? 1 : -1;
    } else {
      return valueA < valueB ? 1 : -1;
    }
  });

  const filteredIlanlar = sortedIlanlar.filter(
    (ad) =>
      ad?.adId?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad?.adId?.category?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      ad?.adId?.subCategory?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const toggleSearch = () => {
    setIsSearchExpanded(!isSearchExpanded);
  };

  if (loading) {
    return <LoadingSpinner message="Favorileriniz Yükleniyor" />;
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-red-50 border-l-4 border-red-500 text-red-700 p-6 rounded-md shadow-md m-4"
        role="alert"
      >
        <div className="flex items-center">
          <svg
            className="h-6 w-6 text-red-500 mr-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <p className="font-bold">{error}</p>
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
  }

  if (!ilanlar.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center p-6 md:p-12 bg-white shadow-md rounded-lg m-4"
      >
        <div className="mx-auto w-20 h-20 md:w-24 md:h-24 bg-red-50 rounded-full flex items-center justify-center mb-6">
          <FaHeart className="text-red-500 text-2xl md:text-3xl" />
        </div>
        <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">
          Henüz favoriniz yok
        </h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          Beğendiğiniz ilanları favorilerinize ekleyerek daha sonra kolayca
          erişebilirsiniz.
        </p>
        <Link
          to="/ads"
          className="inline-flex items-center px-5 py-2.5 md:px-6 md:py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
        >
          İlanları Keşfet
        </Link>
      </motion.div>
    );
  }

  const MobileCard = ({ ad }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-white rounded-lg shadow-md overflow-hidden mb-3"
    >
      <div className="flex">
        <div className="w-1/3 h-32">
          <img
            src={
              ad?.adId?.images?.length
                ? ad?.adId?.images[0]
                : 'https://media.istockphoto.com/id/1324356458/tr/vekt%C3%B6r/picture-icon-photo-frame-symbol-landscape-sign-photograph-gallery-logo-web-interface-and.jpg?s=612x612&w=0&k=20&c=khO1-2i1TZ67Nak9JQWmDx7Slai72lbl6SEp2gDOaV8='
            }
            alt={ad?.adId?.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="w-2/3 p-3">
          <h3 className="font-medium text-gray-900 mb-1 truncate">
            {ad?.adId?.title}
          </h3>
          <div className="flex flex-wrap gap-1 mb-2">
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
              {ad?.adId?.category?.name}
            </span>
            {ad?.adId?.subCategory?.name && (
              <span className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full">
                {ad?.adId?.subCategory?.name}
              </span>
            )}
          </div>
          <div className="flex justify-between items-center">
            <span className="text-blue-600 font-medium">
              {ad?.adId?.price ? `${ad?.adId?.price}₺` : 'Fiyat Belirtilmedi'}
              <span className="text-xs text-gray-500 block">
                {ad?.adId?.priceType || 'saatlik'}
              </span>
            </span>
            <div className="flex space-x-2">
              <Link
                to={`/dashboard/my-ads/${ad?.adId?._id}`}
                className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full"
              >
                <FaEye className="h-5 w-5" />
              </Link>
              <button
                onClick={() => favoriActions(ad?.adId?._id)}
                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full"
              >
                <FaHeart className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-3 md:p-8 bg-gray-50 min-h-screen"
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white shadow-md rounded-lg overflow-hidden"
      >
        {isMobile && (
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <span className="bg-red-100 text-red-800 p-1.5 rounded-lg mr-2">
                  <FaHeart className="text-lg" />
                </span>
                Favorilerim
                <span className="ml-2 text-sm font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                  {filteredIlanlar.length}
                </span>
              </h2>
              <div className="flex space-x-2">
                <button
                  onClick={toggleSearch}
                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full"
                >
                  <FaSearch className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleSort(activeFilter || 'title')}
                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full"
                >
                  <FaFilter className="h-5 w-5" />
                </button>
              </div>
            </div>

            {isSearchExpanded && (
              <div className="relative mb-2">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Favorilerde ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-10 py-2 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  autoFocus
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <FaTimes className="text-gray-400" />
                  </button>
                )}
              </div>
            )}

            {activeFilter && (
              <div className="flex flex-wrap gap-2 mt-2">
                <div className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  <span className="mr-1">
                    {activeFilter === 'title'
                      ? 'Başlık'
                      : activeFilter === 'price'
                      ? 'Fiyat'
                      : 'Kategori'}
                  </span>
                  {sortOrder === 'asc' ? (
                    <FaChevronUp className="h-3 w-3" />
                  ) : (
                    <FaChevronDown className="h-3 w-3" />
                  )}
                  <button
                    onClick={() => setActiveFilter(null)}
                    className="ml-2 text-blue-700"
                  >
                    <FaTimes className="h-3 w-3" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        {!isMobile && (
          <div className="flex flex-col md:flex-row justify-between items-center p-6 border-b border-gray-200">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-0 flex items-center">
              <span className="bg-red-100 text-red-800 p-2 rounded-lg mr-3">
                <FaHeart className="text-xl" />
              </span>
              Favori İlanlarım
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="ml-3 text-sm font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full"
              >
                {filteredIlanlar.length} ilan
              </motion.span>
            </h2>

            <div className="relative w-full md:w-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Favorilerde ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full md:w-64 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>
          </div>
        )}
        {isMobile ? (
          <div className="p-3">
            {filteredIlanlar.length === 0 ? (
              <div className="py-8 text-center">
                <FaSearch className="mx-auto text-4xl text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">
                  Sonuç bulunamadı
                </h3>
                <p className="mt-1 text-gray-500">
                  Arama kriterlerinize uygun favori ilan bulunamadı.
                </p>
              </div>
            ) : (
              <AnimatePresence>
                {filteredIlanlar.map((ad, index) => (
                  <MobileCard key={ad?.adId?._id || index} ad={ad} />
                ))}
              </AnimatePresence>
            )}
          </div>
        ) : (
          /* Desktop Görünüm - Tablo */
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Resim
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('title')}
                      className="flex items-center focus:outline-none"
                    >
                      Başlık
                      {activeFilter === 'title' && (
                        <span className="ml-1">
                          {sortOrder === 'asc' ? (
                            <FaChevronUp className="h-3 w-3" />
                          ) : (
                            <FaChevronDown className="h-3 w-3" />
                          )}
                        </span>
                      )}
                    </button>
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('category')}
                      className="flex items-center focus:outline-none"
                    >
                      Kategori
                      {activeFilter === 'category' && (
                        <span className="ml-1">
                          {sortOrder === 'asc' ? (
                            <FaChevronUp className="h-3 w-3" />
                          ) : (
                            <FaChevronDown className="h-3 w-3" />
                          )}
                        </span>
                      )}
                    </button>
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Alt Kategori
                  </th>
                  <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('price')}
                      className="flex items-center justify-center focus:outline-none"
                    >
                      Fiyat
                      {activeFilter === 'price' && (
                        <span className="ml-1">
                          {sortOrder === 'asc' ? (
                            <FaChevronUp className="h-3 w-3" />
                          ) : (
                            <FaChevronDown className="h-3 w-3" />
                          )}
                        </span>
                      )}
                    </button>
                  </th>
                  <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <AnimatePresence>
                  {filteredIlanlar.map((ad, index) => (
                    <motion.tr
                      key={ad?.adId?._id || index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        transition: { delay: index * 0.05 },
                      }}
                      exit={{ opacity: 0, y: -20 }}
                      whileHover={{
                        backgroundColor: 'rgba(243, 244, 246, 0.7)',
                      }}
                      className="transition duration-150 ease-in-out"
                    >
                      <td className="py-4 px-4">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          className="w-16 h-16 md:w-20 md:h-20 overflow-hidden rounded-md shadow-sm"
                        >
                          <img
                            src={
                              ad?.adId?.images?.length
                                ? ad?.adId?.images[0]
                                : 'https://media.istockphoto.com/id/1324356458/tr/vekt%C3%B6r/picture-icon-photo-frame-symbol-landscape-sign-photograph-gallery-logo-web-interface-and.jpg?s=612x612&w=0&k=20&c=khO1-2i1TZ67Nak9JQWmDx7Slai72lbl6SEp2gDOaV8='
                            }
                            alt={ad?.adId?.title}
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                          />
                        </motion.div>
                      </td>
                      <td className="py-4 px-4 text-sm md:text-base text-gray-900">
                        <div className="font-medium">{ad?.adId?.title}</div>
                        <div className="text-xs text-gray-500 line-clamp-1">
                          {ad?.adId?.description || 'Açıklama bulunmuyor'}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm md:text-base text-gray-900">
                        {ad?.adId?.category?.name}
                      </td>
                      <td className="py-4 px-4 text-sm md:text-base text-gray-900">
                        {ad?.adId?.subCategory?.name}
                      </td>
                      <td className="py-4 px-4 text-sm md:text-base font-medium text-blue-600 text-center">
                        {ad?.adId?.price
                          ? `${ad?.adId?.price}₺`
                          : 'Fiyat Belirtilmedi'}
                        <div className="text-xs text-gray-500">
                          {ad?.adId?.priceType || 'saatlik'}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center space-x-3">
                          <motion.div
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Link
                              to={`/dashboard/my-ads/${ad?.adId?._id}`}
                              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors"
                              title="Görüntüle"
                            >
                              <FaEye className="h-5 w-5" />
                            </Link>
                          </motion.div>
                          <motion.button
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => favoriActions(ad?.adId?._id)}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                            title="Favorilerden Çıkar"
                          >
                            <FaHeart className="h-5 w-5" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>

                {filteredIlanlar.length === 0 && (
                  <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <td colSpan="6" className="py-12 text-center">
                      <div className="flex flex-col items-center">
                        <FaSearch className="text-4xl text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">
                          Sonuç bulunamadı
                        </h3>
                        <p className="mt-1 text-gray-500">
                          Arama kriterlerinize uygun favori ilan bulunamadı.
                        </p>
                      </div>
                    </td>
                  </motion.tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Favorites;
