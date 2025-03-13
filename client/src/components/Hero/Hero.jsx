import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  MdVerified,
  MdTrendingUp,
  MdStar,
  MdArrowForward,
  MdLocationOn,
  MdPeople,
  MdCategory,
} from 'react-icons/md';
import HeroImg from '../../assets/hero-1.jpg';
import { fetchStats } from '../../api/statsApi';

const Hero = () => {
  const popularCategories = [
    'Temizlik',
    'Tadilat',
    'Nakliyat',
    'Özel Ders',
    'Bakım',
    'Taşıma',
    'Montaj',
  ];

  const [stats, setStats] = useState({
    userCount: 0,
    categoryCount: 0,
    cityCount: 0,
  });

  const [counts, setCounts] = useState({
    userCount: 0,
    categoryCount: 0,
    cityCount: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [hasAnimated, setHasAnimated] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    const getStats = async () => {
      try {
        setIsLoading(true);
        const data = await fetchStats();

        setStats({
          userCount: data.User || 0,
          categoryCount: data.SubCategory || 0,
          cityCount: data.City || 0,
        });
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
        setStats({
          userCount: 100,
          categoryCount: 50,
          cityCount: 81,
        });
      }
    };
    getStats();
  }, []);

  useEffect(() => {
    if (
      isLoading ||
      hasAnimated ||
      (!stats.userCount && !stats.categoryCount && !stats.cityCount)
    )
      return;

    const duration = 2000; 
    const frameDuration = 1000 / 60;
    const totalFrames = Math.round(duration / frameDuration);

    let frame = 0;
    const counter = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;

      setCounts({
        userCount: Math.floor(progress * stats.userCount),
        categoryCount: Math.floor(progress * stats.categoryCount),
        cityCount: Math.floor(progress * stats.cityCount),
      });

      if (frame === totalFrames) {
        clearInterval(counter);
        setHasAnimated(true);
      }
    }, frameDuration);

    return () => clearInterval(counter);
  }, [stats, isLoading, hasAnimated]); 

  useEffect(() => {
    if (!heroRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          document
            .querySelectorAll('.animate-on-scroll')
            .forEach((el, index) => {
              setTimeout(() => {
                el.classList.add('animate-visible');
              }, index * 100); 
            });
        }
      },
      { threshold: 0.1 } 
    );

    observer.observe(heroRef.current);

    return () => {
      if (heroRef.current) {
        observer.unobserve(heroRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={heroRef}
      className="relative min-h-[650px] flex items-center overflow-hidden"
    >
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.85)), url(${HeroImg})`,
        }}
      />

      <div className="absolute inset-0 z-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRjMC0yLjIgMS44LTQgNC00czQgMS44IDQgNC0xLjggNC00IDQtNC0xLjgtNC00bTAtMTZjMC0yLjIgMS44LTQgNC00czQgMS44IDQgNC0xLjggNC00IDQtNC0xLjgtNC00bTE2IDE2YzAtMi4yIDEuOC00IDQtNHM0IDEuOCA0IDQtMS44IDQtNCA0LTQtMS44LTQtNG0tMTYgMTZjMC0yLjIgMS44LTQgNC00czQgMS44IDQgNC0xLjggNC00IDQtNC0xLjgtNC00bTE2IDE2YzAtMi4yIDEuOC00IDQtNHM0IDEuOCA0IDQtMS44IDQtNCA0LTQtMS44LTQtNG0tMTYtMzJjMC0yLjIgMS44LTQgNC00czQgMS44IDQgNC0xLjggNC00IDQtNC0xLjgtNC00bTE2LTE2YzAtMi4yIDEuOC00IDQtNHM0IDEuOCA0IDQtMS44IDQtNCA0LTQtMS44LTQtNG0tMTYgMGMwLTIuMiAxLjgtNCA0LTRzNCAxLjggNCA0LTEuOCA0LTQgNC00LTEuOC00LTRtLTE2IDE2YzAtMi4yIDEuOC00IDQtNHM0IDEuOCA0IDQtMS44IDQtNCA0LTQtMS44LTQtNG0wIDE2YzAtMi4yIDEuOC00IDQtNHM0IDEuOCA0IDQtMS44IDQtNCA0LTQtMS44LTQtNG0wIDE2YzAtMi4yIDEuOC00IDQtNHM0IDEuOCA0IDQtMS44IDQtNCA0LTQtMS44LTQtNCIvPjwvZz48L2c+PC9zdmc+')]"></div>

      <div className="absolute top-1/4 left-10 w-24 h-24 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-10 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="animate-on-scroll text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 opacity-0 transform translate-y-8">
            İstediğin Hizmete Ulaş...{' '}
            <span className="relative font-bold uppercase text-transparent bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text animate-gradient">
              Çözüldü
            </span>
          </h1>

          <p className="animate-on-scroll text-lg md:text-xl text-gray-300 mb-8 opacity-0 transform translate-y-8">
            Türkiye'nin en büyük hizmet platformunda ihtiyacınız olan her şey
            tek tıkla yanınızda
          </p>

          <div className="animate-on-scroll flex flex-col sm:flex-row justify-center gap-4 mb-12 opacity-0 transform translate-y-8">
            <Link
              to="/register"
              className="group px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl relative overflow-hidden"
            >
              <span className="relative z-10">Hizmet Ver</span>
              <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </Link>
            <Link
              to="/categories"
              className="group px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg text-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center">
                Hizmet Kategorileri
                <MdArrowForward className="ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
              </span>
              <span className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </Link>
          </div>
          <div className="animate-on-scroll mb-12 opacity-0 transform translate-y-8">
            <h3 className="text-white text-lg mb-4 font-medium">
              Popüler Hizmetler
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {popularCategories.map((category, index) => (
                <Link
                  key={index}
                  to={`/category/${category.toLowerCase()}`}
                  className="group px-4 py-2 bg-white/10 hover:bg-white/20 
                     text-white rounded-full text-sm
                     transition-all duration-300
                     border border-white/10 hover:border-white/30 relative overflow-hidden"
                >
                  <span className="relative z-10">{category}</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-blue-700/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                </Link>
              ))}
            </div>
          </div>

          <div className="animate-on-scroll grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 max-w-3xl mx-auto text-white mb-12 opacity-0 transform translate-y-8">
            <div className="group flex flex-col items-center p-5 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 relative overflow-hidden">
              <div className="mb-3 p-3 bg-blue-600/20 rounded-full group-hover:bg-blue-600/30 transition-colors duration-300">
                <MdVerified className="text-2xl text-blue-400" />
              </div>
              <h3 className="font-semibold mb-1">Güvenilir Hizmet</h3>
              <p className="text-sm text-gray-300">
                Onaylı ve güvenilir hizmet verenler
              </p>
              <span className="absolute inset-0 bg-gradient-to-b from-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
            </div>
            <div className="group flex flex-col items-center p-5 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 relative overflow-hidden">
              <div className="mb-3 p-3 bg-blue-600/20 rounded-full group-hover:bg-blue-600/30 transition-colors duration-300">
                <MdTrendingUp className="text-2xl text-blue-400" />
              </div>
              <h3 className="font-semibold mb-1">Hızlı Çözüm</h3>
              <p className="text-sm text-gray-300">
                Dakikalar içinde teklifler alın
              </p>
              <span className="absolute inset-0 bg-gradient-to-b from-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
            </div>
            <div className="group flex flex-col items-center p-5 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 relative overflow-hidden">
              <div className="mb-3 p-3 bg-blue-600/20 rounded-full group-hover:bg-blue-600/30 transition-colors duration-300">
                <MdStar className="text-2xl text-blue-400" />
              </div>
              <h3 className="font-semibold mb-1">Kaliteli Hizmet</h3>
              <p className="text-sm text-gray-300">
                Değerlendirmelerle kanıtlanmış kalite
              </p>
              <span className="absolute inset-0 bg-gradient-to-b from-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
            </div>
          </div>

          <div className="animate-on-scroll flex flex-wrap justify-center gap-8 md:gap-16 opacity-0 transform translate-y-8">
            <div className="text-center group relative">
              <div className="absolute -inset-4 bg-blue-500/5 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300"></div>
              <div className="relative flex flex-col items-center">
                <MdPeople className="text-2xl text-blue-400 mb-1 opacity-75" />
                <p className="text-3xl md:text-4xl font-bold text-blue-400 flex items-center">
                  {isLoading ? (
                    <span className="inline-block w-12 h-8 bg-blue-400/20 rounded animate-pulse"></span>
                  ) : (
                    <>{counts.userCount.toLocaleString()}+</>
                  )}
                </p>
                <p className="text-sm text-gray-400">Hizmet Veren</p>
              </div>
            </div>
            <div className="text-center group relative">
              <div className="absolute -inset-4 bg-blue-500/5 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300"></div>
              <div className="relative flex flex-col items-center">
                <MdCategory className="text-2xl text-blue-400 mb-1 opacity-75" />
                <p className="text-3xl md:text-4xl font-bold text-blue-400">
                  {isLoading ? (
                    <span className="inline-block w-12 h-8 bg-blue-400/20 rounded animate-pulse"></span>
                  ) : (
                    <>{counts.categoryCount.toLocaleString()}+</>
                  )}
                </p>
                <p className="text-sm text-gray-400">Hizmet Kategorisi</p>
              </div>
            </div>
            <div className="text-center group relative">
              <div className="absolute -inset-4 bg-blue-500/5 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300"></div>
              <div className="relative flex flex-col items-center">
                <MdLocationOn className="text-2xl text-blue-400 mb-1 opacity-75" />
                <p className="text-3xl md:text-4xl font-bold text-blue-400">
                  {isLoading ? (
                    <span className="inline-block w-12 h-8 bg-blue-400/20 rounded animate-pulse"></span>
                  ) : (
                    <>{counts.cityCount.toLocaleString()}</>
                  )}
                </p>
                <p className="text-sm text-gray-400">İlde Hizmet</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        .animate-on-scroll {
          transition: opacity 0.8s ease, transform 0.8s ease;
        }

        .animate-visible {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 0.6;
          }
          50% {
            opacity: 0.3;
          }
        }

        .animate-pulse {
          animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default Hero;
