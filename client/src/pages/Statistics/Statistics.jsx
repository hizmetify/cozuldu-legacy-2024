import { useState, useEffect, useRef } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Label,
} from 'recharts';
import { FaEye, FaChartLine, FaUsers, FaHeart, FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserAds } from '../../features/ad/adSlice';
import { fetchStats } from '../../api/statsApi';
import { countFav } from '../../api/userApi';
import { motion, AnimatePresence } from 'framer-motion';
import Spinner from '../../components/UI/Spinner'; 
const COLORS = {
  views: ['#0082F6', '#E2F0FF'],
  favorites: ['#FF4D6D', '#FFE2E6'],
  accent: '#0082F6',
  accentLight: '#E2F0FF',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  text: '#1F2937',
  textLight: '#6B7280',
  background: '#F9FAFB',
  card: '#FFFFFF',
  border: '#E5E7EB',
};

const customTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip p-3 bg-white border rounded-lg shadow-lg text-sm">
        <p className="font-medium">
          {payload[0].name}:{' '}
          <span className="font-bold">{payload[0].value}%</span>
        </p>
      </div>
    );
  }
  return null;
};

const StatCard = ({ title, value, icon: Icon, color, animate = true }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="bg-white rounded-xl shadow-md p-6 border border-gray-100"
  >
    <div className="flex items-center">
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="text-white text-xl" />
      </div>
      <div className="ml-4">
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        <motion.p
          initial={animate ? { opacity: 0, scale: 0.5 } : false}
          animate={animate ? { opacity: 1, scale: 1 } : false}
          transition={{ delay: 0.2, type: 'spring' }}
          className="text-2xl font-bold text-gray-900"
        >
          {value}
        </motion.p>
      </div>
    </div>
  </motion.div>
);

const AdStatCard = ({ ad, totalUsers, favCounts, index }) => {
  const totalViewers = ad.viewing?.length || 0;
  const totalFavorites = favCounts;

  const viewPercentage = ((totalViewers * 100) / totalUsers).toFixed(2);
  const favoritePercentage =
    totalViewers > 0
      ? ((totalFavorites * 100) / totalViewers).toFixed(2)
      : '0.00';

  const viewData = [
    {
      name: 'Görüntüleyen Kullanıcılar',
      value: Number.parseFloat(viewPercentage),
    },
    {
      name: 'Diğer Kullanıcılar',
      value: 100 - Number.parseFloat(viewPercentage),
    },
  ];

  const favoriteData = [
    {
      name: 'Favorileyen Kullanıcılar',
      value: Number.parseFloat(favoritePercentage),
    },
    {
      name: 'Diğer Kullanıcılar',
      value: 100 - Number.parseFloat(favoritePercentage),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
      className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-all duration-300"
    >
      <div className="md:flex">
        <div className="md:w-1/4 relative overflow-hidden">
          <img
            src={
              ad.images?.length
                ? ad.images[0]
                : 'https://media.istockphoto.com/id/1324356458/tr/vekt%C3%B6r/picture-icon-photo-frame-symbol-landscape-sign-photograph-gallery-logo-web-interface-and.jpg?s=612x612&w=0&k=20&c=khO1-2i1TZ67Nak9JQWmDx7Slai72lbl6SEp2gDOaV8='
            }
            alt={ad.title}
            className="w-full h-48 md:h-full object-cover transition-transform duration-500 hover:scale-110"
          />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/60 to-transparent md:hidden"></div>
          <div className="absolute bottom-0 left-0 p-4 text-white md:hidden">
            <h2 className="text-lg font-bold line-clamp-1">{ad.title}</h2>
          </div>
        </div>
        <div className="p-6 md:w-3/4">
          <div className="md:flex items-start">
            <div className="md:w-1/3 mb-6 md:mb-0 md:pr-6">
              <h2 className="text-xl font-bold text-gray-900 hidden md:block mb-3">
                {ad.title}
              </h2>

              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-blue-100 mr-3">
                    <FaEye className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Görüntülenme</p>
                    <p className="text-lg font-semibold">
                      {totalViewers.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-red-100 mr-3">
                    <FaHeart className="text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Favorileme</p>
                    <p className="text-lg font-semibold">
                      {totalFavorites.toLocaleString()}
                    </p>
                  </div>
                </div>

                <Link
                  to={`/dashboard/my-ads/${ad._id}`}
                  className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FaEye className="mr-2" /> İlanı Görüntüle
                </Link>
              </div>
            </div>
            <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4 h-64">
                <h3 className="text-center font-medium text-gray-700 mb-2">
                  Görüntülenme Oranı
                </h3>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={viewData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        fill="#8884d8"
                        paddingAngle={2}
                        dataKey="value"
                        animationBegin={300}
                        animationDuration={1000}
                      >
                        {viewData.map((entry, idx) => (
                          <Cell
                            key={`cell-${idx}`}
                            fill={COLORS.views[idx % COLORS.views.length]}
                          />
                        ))}
                        <Label
                          position="center"
                          content={({ viewBox }) => {
                            const { cx, cy } = viewBox;
                            return (
                              <g>
                                <text
                                  x={cx}
                                  y={cy}
                                  textAnchor="middle"
                                  dominantBaseline="middle"
                                  className="text-lg font-bold"
                                >
                                  {viewPercentage}%
                                </text>
                                <text
                                  x={cx}
                                  y={cy + 20}
                                  textAnchor="middle"
                                  dominantBaseline="middle"
                                  className="text-xs text-gray-500"
                                >
                                  Görüntülenme
                                </text>
                              </g>
                            );
                          }}
                        />
                      </Pie>
                      <Tooltip content={customTooltip} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 h-64">
                <h3 className="text-center font-medium text-gray-700 mb-2">
                  Favorileme Oranı
                </h3>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={favoriteData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        fill="#82ca9d"
                        paddingAngle={2}
                        dataKey="value"
                        animationBegin={600}
                        animationDuration={1000}
                      >
                        {favoriteData.map((entry, idx) => (
                          <Cell
                            key={`cell-${idx}`}
                            fill={
                              COLORS.favorites[idx % COLORS.favorites.length]
                            }
                          />
                        ))}
                        <Label
                          position="center"
                          content={({ viewBox }) => {
                            const { cx, cy } = viewBox;
                            return (
                              <g>
                                <text
                                  x={cx}
                                  y={cy}
                                  textAnchor="middle"
                                  dominantBaseline="middle"
                                  className="text-lg font-bold"
                                >
                                  {favoritePercentage}%
                                </text>
                                <text
                                  x={cx}
                                  y={cy + 20}
                                  textAnchor="middle"
                                  dominantBaseline="middle"
                                  className="text-xs text-gray-500"
                                >
                                  Favorileme
                                </text>
                              </g>
                            );
                          }}
                        />
                      </Pie>
                      <Tooltip content={customTooltip} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Statistics = () => {
  const [stats, setStats] = useState({ userCount: 0 });
  const [counts, setCounts] = useState({ userCount: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const heroRef = useRef(null);
  const dispatch = useDispatch();
  const {
    userAds,
    userAdsStatus: status,
    error,
  } = useSelector((state) => state.ads);
  const [favCounts, setFavCounts] = useState({});

  useEffect(() => {
    const getStats = async () => {
      setIsLoading(true);
      try {
        const data = await fetchStats();
        setStats({ userCount: data.User || 0 });
      } catch (error) {
        setStats({ userCount: 100 });
      } finally {
        setIsLoading(false);
      }
    };
    getStats();
  }, []);

  useEffect(() => {
    if (isLoading || hasAnimated || !stats.userCount) return;
    const duration = 2000;
    const totalFrames = Math.round(duration / (1000 / 60));

    let frame = 0;
    const counter = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      setCounts({ userCount: Math.floor(progress * stats.userCount) });
      if (frame === totalFrames) {
        clearInterval(counter);
        setHasAnimated(true);
      }
    }, 1000 / 60);

    return () => clearInterval(counter);
  }, [stats, isLoading, hasAnimated]);

  useEffect(() => {
    dispatch(fetchUserAds());
  }, [dispatch]);

  useEffect(() => {
    const fetchAllFavCounts = async () => {
      if (Array.isArray(userAds?.data)) {
        const counts = {};
        for (const ad of userAds.data) {
          try {
            const result = await countFav(ad._id);
            counts[ad._id] = result.data.data;
          } catch (error) {
            console.error('Error fetching favorite counts:', error);
            counts[ad._id] = 0;
          }
        }
        setFavCounts(counts);
      }
    };

    fetchAllFavCounts();
  }, [userAds]);

  const filteredAds = (
    Array.isArray(userAds?.data) ? userAds.data : userAds || []
  ).filter(
    (ad) =>
      ad.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (status === 'loading' || isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center w-full h-[70vh]"
      >
        <Spinner className="w-12 h-12 text-blue-600" />
        <p className="mt-4 text-gray-600 animate-pulse">
          İstatistikler yükleniyor...
        </p>
      </motion.div>
    );
  }
  if (status === 'failed') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-3xl mx-auto my-12 bg-red-50 border-l-4 border-red-500 text-red-700 p-6 rounded-md shadow-md"
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
          <p className="font-bold">İstatistikler yüklenirken bir hata oluştu</p>
        </div>
        <p className="mt-2">{error}</p>
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
  if (!filteredAds.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto my-12 text-center p-12 bg-white shadow-md rounded-lg"
      >
        <div className="mx-auto w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6">
          <FaChartLine className="text-blue-600 text-3xl" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Henüz istatistik gösterilecek ilan yok
        </h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          İlanlarınız oluşturulduktan sonra görüntülenme ve favorileme
          istatistiklerini burada takip edebilirsiniz.
        </p>
        <Link
          to="/emailverify"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
        >
          Yeni İlan Ekle
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray-50 min-h-screen"
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 flex items-center">
              <span className="bg-blue-100 text-blue-800 p-2 rounded-lg mr-3">
                <FaChartLine className="text-xl" />
              </span>
              İstatistikler
            </h1>
            <p className="text-gray-500 text-lg mt-2">
              Hizmetlerinize olan ilgiyi buradan takip edebilirsiniz
            </p>
          </div>

          <div className="mt-4 md:mt-0 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="İlanlarınızda ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full md:w-64 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
          </div>
        </div>
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Toplam Kullanıcı"
          value={counts.userCount.toLocaleString()}
          icon={FaUsers}
          color="bg-blue-600"
        />

        <StatCard
          title="Toplam İlanınız"
          value={filteredAds.length}
          icon={FaChartLine}
          color="bg-green-600"
        />

        <StatCard
          title="Toplam Görüntülenme"
          value={filteredAds
            .reduce((total, ad) => total + (ad.viewing?.length || 0), 0)
            .toLocaleString()}
          icon={FaEye}
          color="bg-purple-600"
        />
      </div>
      <div className="space-y-6">
        <AnimatePresence>
          {filteredAds.map((ad, index) => (
            <AdStatCard
              key={ad._id}
              ad={ad}
              totalUsers={stats.userCount}
              favCounts={favCounts[ad._id] || 0}
              index={index}
            />
          ))}
        </AnimatePresence>

        {filteredAds.length === 0 && searchTerm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-12 text-center bg-white rounded-lg shadow-md"
          >
            <FaSearch className="mx-auto text-4xl text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">
              Sonuç bulunamadı
            </h3>
            <p className="mt-1 text-gray-500">
              Arama kriterlerinize uygun ilan bulunamadı.
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Statistics;
