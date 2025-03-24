import { useState, useEffect, useMemo, useCallback, memo } from 'react';
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
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import MetaHelmet from '../../utils/MetaHelmet';

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
const CustomTooltip = ({ active, payload }) => {
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

const StatCard = memo(({ title, value, icon: Icon, color }) => (
  <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
    <div className="flex items-center">
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="text-white text-xl" />
      </div>
      <div className="ml-4">
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
));

const AdStatCard = memo(({ ad, totalUsers, favCounts, index }) => {
  const totalViewers = ad.viewing?.length || 0;
  const totalFavorites = favCounts;

  const { viewPercentage, favoritePercentage, viewData, favoriteData } =
    useMemo(() => {
      const viewPerc = ((totalViewers * 100) / totalUsers).toFixed(2);
      const favPerc =
        totalViewers > 0
          ? ((totalFavorites * 100) / totalViewers).toFixed(2)
          : '0.00';

      const vData = [
        {
          name: 'Görüntüleyen Kullanıcılar',
          value: Number.parseFloat(viewPerc),
        },
        {
          name: 'Diğer Kullanıcılar',
          value: 100 - Number.parseFloat(viewPerc),
        },
      ];

      const fData = [
        {
          name: 'Favorileyen Kullanıcılar',
          value: Number.parseFloat(favPerc),
        },
        {
          name: 'Diğer Kullanıcılar',
          value: 100 - Number.parseFloat(favPerc),
        },
      ];

      return {
        viewPercentage: viewPerc,
        favoritePercentage: favPerc,
        viewData: vData,
        favoriteData: fData,
      };
    }, [totalViewers, totalUsers, totalFavorites]);

  return (
    <div
      className={`bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-all duration-300 ${
        index < 3 ? '' : 'opacity-0 translate-y-4'
      }`}
      style={{
        animationDelay: `${index * 100}ms`,
        animationFillMode: 'forwards',
        animation: index < 3 ? 'fadeIn 0.4s ease-out forwards' : 'none',
      }}
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
            className="w-full h-48 md:h-full object-cover"
            loading="lazy"
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
                        animationDuration={500}
                      >
                        {viewData.map((entry, idx) => (
                          <Cell
                            key={`cell-${idx}`}
                            fill={COLORS.views[idx % COLORS.views.length]}
                          />
                        ))}
                        <Label
                          position="center"
                          content={() => (
                            <g>
                              <text
                                x="50%"
                                y="50%"
                                textAnchor="middle"
                                dominantBaseline="middle"
                                className="text-lg font-bold"
                              >
                                {viewPercentage}%
                              </text>
                              <text
                                x="50%"
                                y="50%"
                                dy="20"
                                textAnchor="middle"
                                dominantBaseline="middle"
                                className="text-xs text-gray-500"
                              >
                                Görüntülenme
                              </text>
                            </g>
                          )}
                        />
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
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
                        animationDuration={500}
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
                          content={() => (
                            <g>
                              <text
                                x="50%"
                                y="50%"
                                textAnchor="middle"
                                dominantBaseline="middle"
                                className="text-lg font-bold"
                              >
                                {favoritePercentage}%
                              </text>
                              <text
                                x="50%"
                                y="50%"
                                dy="20"
                                textAnchor="middle"
                                dominantBaseline="middle"
                                className="text-xs text-gray-500"
                              >
                                Favorileme
                              </text>
                            </g>
                          )}
                        />
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

const animationStyles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .fade-in {
    animation: fadeIn 0.3s ease-out forwards;
  }
`;

const Statistics = () => {
  const [stats, setStats] = useState({ userCount: 0 });
  const [counts, setCounts] = useState({ userCount: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [favCounts, setFavCounts] = useState({});
  const dispatch = useDispatch();
  const {
    userAds,
    userAdsStatus: status,
    error,
  } = useSelector((state) => state.ads);

  useEffect(() => {
    const getStats = async () => {
      setIsLoading(true);
      try {
        const data = await fetchStats();
        setStats({ userCount: data.User || 0 });
      } catch (error) {
        console.error('Stats fetch error:', error);
        setStats({ userCount: 100 });
      } finally {
        setIsLoading(false);
      }
    };
    getStats();
  }, []);

  useEffect(() => {
    if (isLoading || hasAnimated || !stats.userCount) return;

    const duration = 1000;
    const totalFrames = 20;
    const increment = stats.userCount / totalFrames;

    let frame = 0;
    let currentCount = 0;

    const counter = setInterval(() => {
      frame++;
      currentCount += increment;
      setCounts({ userCount: Math.floor(currentCount) });

      if (frame === totalFrames) {
        setCounts({ userCount: stats.userCount });
        clearInterval(counter);
        setHasAnimated(true);
      }
    }, duration / totalFrames);

    return () => clearInterval(counter);
  }, [stats, isLoading, hasAnimated]);

  useEffect(() => {
    dispatch(fetchUserAds());
  }, [dispatch]);
  useEffect(() => {
    const fetchAllFavCounts = async () => {
      if (!Array.isArray(userAds?.data) || userAds.data.length === 0) return;

      const adsToFetch = userAds.data.slice(0, 10);
      const counts = {};
      try {
        const results = await Promise.all(
          adsToFetch.map((ad) => countFav(ad._id))
        );

        results.forEach((result, index) => {
          counts[adsToFetch[index]._id] = result.data.data;
        });

        setFavCounts(counts);
      } catch (error) {
        console.error('Error fetching favorite counts:', error);
      }
    };

    fetchAllFavCounts();
  }, [userAds]);

  const filteredAds = useMemo(() => {
    const ads = Array.isArray(userAds?.data) ? userAds.data : userAds || [];
    if (!searchTerm) return ads;

    return ads.filter(
      (ad) =>
        ad.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ad.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [userAds, searchTerm]);

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  if (status === 'loading' || isLoading) {
    return <LoadingSpinner message="İstatistikler yükleniyor" />;
  }

  if (status === 'failed') {
    return (
      <>
        <MetaHelmet
          title="İstatistikler"
          description="İlanlarınızın performans istatistiklerini görüntüleyin ve analiz edin."
          keywords="istatistikler, ilan performansı, görüntülenme, favorileme"
          canonical={`${window.location.origin}/dashboard/statistics`}
        />
        <div className="max-w-3xl mx-auto my-12 bg-red-50 border-l-4 border-red-500 text-red-700 p-6 rounded-md shadow-md fade-in">
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
            <p className="font-bold">
              İstatistikler yüklenirken bir hata oluştu
            </p>
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
        </div>
      </>
    );
  }

  return (
    <>
      <style>{animationStyles}</style>
      <MetaHelmet
        title="İstatistikler"
        description="İlanlarınızın performans istatistiklerini görüntüleyin ve analiz edin."
        keywords="istatistikler, ilan performansı, görüntülenme, favorileme"
        canonical={`${window.location.origin}/dashboard/statistics`}
      />
      {!filteredAds.length ? (
        <div className="max-w-3xl mx-auto my-12 text-center p-12 bg-white shadow-md rounded-lg fade-in">
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
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray-50 min-h-screen">
          <div className="mb-8 fade-in">
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
                  onChange={handleSearchChange}
                  className="pl-10 pr-4 py-2 w-full md:w-64 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>
            </div>
          </div>
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
            {filteredAds.slice(0, 10).map((ad, index) => (
              <AdStatCard
                key={ad._id}
                ad={ad}
                totalUsers={stats.userCount}
                favCounts={favCounts[ad._id] || 0}
                index={index}
              />
            ))}

            {filteredAds.length > 10 && (
              <div className="text-center py-4">
                <p className="text-gray-500">
                  Performans nedeniyle sadece ilk 10 ilan gösteriliyor.
                </p>
              </div>
            )}

            {filteredAds.length === 0 && searchTerm && (
              <div className="p-12 text-center bg-white rounded-lg shadow-md fade-in">
                <FaSearch className="mx-auto text-4xl text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">
                  Sonuç bulunamadı
                </h3>
                <p className="mt-1 text-gray-500">
                  Arama kriterlerinize uygun ilan bulunamadı.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Statistics;
