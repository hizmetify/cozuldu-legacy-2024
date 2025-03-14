import { useState, useEffect, useRef } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Label } from "recharts";
import { FaEdit, FaEye } from 'react-icons/fa';
import { FaRegTrashCan } from 'react-icons/fa6';
import { Link, useNavigate } from 'react-router-dom'; 
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserAds, deleteAd } from '../../features/ad/adSlice';
import { fetchStats } from '../../api/statsApi';
import { countFav } from '../../api/userApi';

const COLORS = ["#0082F6", "#adadad"]; // Renkler

const customTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip p-2 bg-white border rounded shadow-md">
        <p>{payload[0].name}: {payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

const Statistics = () => {
  const [stats, setStats] = useState({ userCount: 0 });
  const [counts, setCounts] = useState({ userCount: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [hasAnimated, setHasAnimated] = useState(false);
  const heroRef = useRef(null);
  const [favoriler, setFavoriler] = useState([]);
  const dispatch = useDispatch();
  const { userAds, userAdsStatus: status, error } = useSelector((state) => state.ads); 

  // Stats API'yi çekme
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

  // Sayacın animasyonu
  useEffect(() => {
    if (isLoading || hasAnimated || !stats.userCount) return;
    const duration = 2000; // animasyon süresi
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

  // Ads verisini çekme
  useEffect(() => {
    dispatch(fetchUserAds());
  }, [dispatch]);


  
  // Görüntüleme oranı hesaplama
  const calculatePercentage = (value, total) => ((value * 100) / total).toFixed(2);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-2 py-12">
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold text-gray-900">İstatistikler</h1>
        <p className="text-gray-500 text-lg">Hizmetlerinize olan ilgiyi buradan takip edebilirsiniz</p>
      </div>

      <div className="py-4 grid grid-cols-1 gap-4">
        {(Array.isArray(userAds?.data) ? userAds.data : userAds || []).map((ad, key) => {
           const [favCounts,setFavCount]=useState(0)
           useEffect(()=>{
              const counts=async()=>{ 
                
                const result=await countFav(ad._id) 
                setFavCount(result.data.data)
              }
              counts()
           },[]) 
          const totalViewers = ad.viewing?.length || 0;
          const totalFavorites = favCounts
          const totalUsers = counts.userCount.toLocaleString();  
          
          const viewPercentage = calculatePercentage(totalViewers, totalUsers);
          const favoritePercentage = calculatePercentage(totalFavorites, totalViewers);

          const data1 = [
            { name: "Görüntüleyen Kullanıcılar", value: parseFloat(viewPercentage) },
            { name: "Diğer Kullanıcılar", value: 100 - parseFloat(viewPercentage) },
          ];

          const data2 = [
            { name: "Favorileyen Kullanıcılar", value: parseFloat(favoritePercentage) },
            { name: "Diğer Kullanıcılar", value: 100 - parseFloat(favoritePercentage) },
          ];

          return (
            <div key={key} className="p-3 shadow-md border rounded-lg text-center space-y-3 md:flex md:flex-row items-center">
              <img
                src={ad.images?.length ? ad.images[0] : 'https://media.istockphoto.com/id/1324356458/tr/vekt%C3%B6r/picture-icon-photo-frame-symbol-landscape-sign-photograph-gallery-logo-web-interface-and.jpg?s=612x612&w=0&k=20&c=khO1-2i1TZ67Nak9JQWmDx7Slai72lbl6SEp2gDOaV8='}
                alt={ad.title}
                className="rounded-md w-full lg:w-1/4 sm:block md:hidden  lg:block"
              />
              <div className="w-full md:w-1/3 mx-3">
                <h2 className="text-lg font-semibold">{ad.title}</h2>
                <p className="text-gray-500">Görüntülenme Sayısı: {totalViewers}</p>
                <p className="text-gray-500">Favorileme Sayısı: {totalFavorites}</p>
              </div>

              <div className="w-full hidden sm:block h-36 sm:flex">
                <ResponsiveContainer className="w-full sm:w-1/2 md:w-full">
                  <PieChart>
                    <Pie data={data1} cx="50%" cy="50%" innerRadius={40} outerRadius={60} fill="#8884d8" paddingAngle={2} dataKey="value">
                      {data1.map((entry, idx) => <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />)}
                      <Label position="center" fill="#000" fontSize={16}>{viewPercentage}%</Label>
                    </Pie>
                    <Tooltip content={customTooltip} />
                  </PieChart>
                </ResponsiveContainer>

                <ResponsiveContainer className="w-full sm:w-1/2 md:w-full">
                  <PieChart>
                    <Pie data={data2} cx="50%" cy="50%" innerRadius={40} outerRadius={60} fill="#82ca9d" paddingAngle={2} dataKey="value">
                      {data2.map((entry, idx) => <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />)}
                      <Label position="center" fill="#000" fontSize={16}>{favoritePercentage}%</Label>
                    </Pie>
                    <Tooltip content={customTooltip} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="flex justify-center gap-4 mt-4">
                <Link to={`/dashboard/my-ads/${ad._id}`} className="text-blue-600 hover:text-blue-800 flex justify-center" title="Görüntüle">
                  <FaEye className="text-xl" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Statistics;
