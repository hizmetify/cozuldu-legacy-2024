import { useEffect, useState, memo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSingleAd } from '../../features/ad/adSlice';
import { useParams, Link } from 'react-router-dom';
import {
  FaMapMarkerAlt,
  FaTag,
  FaClock,
  FaPhone,
  FaWhatsapp,
  FaEnvelope,
  FaShare,
  FaHeart,
  FaEye,
  FaLayerGroup,
  FaFolder,
  FaChevronLeft,
  FaChevronRight,
  FaExpand,
  FaArrowLeft,
  FaRegClock,
  FaRegCalendarAlt,
  FaUserCircle,
  FaCheckCircle,
} from 'react-icons/fa';
import {
  contactTeacher,
  countFav,
  favoriAction,
  favoriIs,
  viewingIs,
} from '../../api/userApi';
import { logs } from '../../api/authApi';
import { motion, AnimatePresence } from 'framer-motion';

import LoadingSpinner from '../../components/UI/LoadingSpinner';
import MetaHelmet from '../../utils/MetaHelmet';

const NotFound = () => (
  <div className="flex h-screen items-center justify-center bg-gray-50">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl bg-white p-8 text-center shadow-xl"
    >
      <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-red-100">
        <FaEye className="h-12 w-12 text-red-500" />
      </div>
      <h3 className="mb-2 text-2xl font-bold text-gray-800">İlan Bulunamadı</h3>
      <p className="mb-6 text-gray-600">
        İstediğiniz ilan silinmiş veya yayından kaldırılmış olabilir.
      </p>
      <Link
        to="/dashboard/my-ads"
        className="inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 text-white transition-all hover:bg-blue-700"
      >
        <FaArrowLeft className="mr-2" /> İlanlarıma Dön
      </Link>
    </motion.div>
  </div>
);

const InfoCard = memo(function InfoCard({ icon, iconBgClass, label, value }) {
  return (
    <motion.div
      whileHover={{ y: -5, x: 0 }}
      className="group rounded-xl bg-white p-5 shadow-md transition-all duration-300 hover:shadow-xl overflow-hidden"
    >
      <div className="mb-3 flex items-center gap-3">
        <div
          className={`rounded-full p-3 transition-colors duration-300 group-hover:text-white ${iconBgClass}`}
        >
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="font-semibold text-gray-800">{value}</p>
        </div>
      </div>
    </motion.div>
  );
});

const ImageCarousel = memo(function ImageCarousel({
  images,
  currentIndex,
  setCurrentIndex,
  onOpenModal,
}) {
  const nextImage = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length, setCurrentIndex]);

  const prevImage = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length, setCurrentIndex]);

  useEffect(() => {
    const timer = setInterval(() => {
      nextImage();
    }, 5000);
    return () => clearInterval(timer);
  }, [nextImage]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl bg-white p-6 shadow-md transition-all hover:shadow-xl overflow-hidden"
    >
      <div className="relative aspect-video overflow-hidden rounded-xl">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            src={images[currentIndex] || '/placeholder.svg'}
            alt={`İlan Resmi ${currentIndex + 1}`}
            className="h-full w-full object-cover"
          />
        </AnimatePresence>

        <div className="absolute bottom-4 right-4 rounded-full bg-black/60 px-3 py-1 text-sm text-white">
          {currentIndex + 1} / {images.length}
        </div>

        <button
          onClick={prevImage}
          className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-3 text-white transition-all hover:bg-black/70"
        >
          <FaChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-3 text-white transition-all hover:bg-black/70"
        >
          <FaChevronRight className="h-5 w-5" />
        </button>
        <button
          onClick={onOpenModal}
          className="absolute right-4 top-4 rounded-full bg-black/50 p-3 text-white transition-all hover:bg-black/70"
        >
          <FaExpand className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 max-w-full">
        {images.map((img, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.05 }}
            onClick={() => setCurrentIndex(index)}
            className={`relative flex-shrink-0 overflow-hidden rounded-lg ${
              currentIndex === index
                ? 'ring-2 ring-blue-500'
                : 'opacity-70 hover:opacity-100'
            }`}
          >
            <img
              src={img || '/placeholder.svg'}
              alt={`Thumbnail ${index + 1}`}
              className="h-20 w-20 object-cover"
            />
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
});

const AllImagesPreview = memo(function AllImagesPreview({
  images,
  onOpenModal,
  setCurrentIndex,
}) {
  if (!images || images.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-lg bg-gray-100">
        <p className="text-gray-500">Resim bulunamadı.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      {images.map((img, index) => (
        <button
          key={index}
          onClick={() => {
            setCurrentIndex(index);
            onOpenModal();
          }}
          className="group relative aspect-square overflow-hidden rounded-lg"
        >
          <img
            src={img || '/placeholder.svg'}
            alt={`İlan Resmi ${index + 1}`}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black opacity-0 transition-opacity group-hover:opacity-20" />
        </button>
      ))}
    </div>
  );
});

const PriceCard = memo(function PriceCard({ price, priceType }) {
  return (
    <motion.div
      whileHover={{ y: -5, x: 0 }}
      className="rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 p-6 text-white shadow-lg transition-all duration-300 hover:shadow-xl overflow-hidden"
    >
      <h3 className="mb-2 text-lg font-semibold">Fiyatlandırma</h3>
      <div className="mb-4">
        <p className="text-4xl font-bold tracking-tight">
          {price ? `${price.toLocaleString('tr-TR')} ₺` : 'Fiyat belirtilmemiş'}
        </p>
        <p className="mt-2 flex items-center text-blue-100">
          <FaClock className="mr-2" />
          {priceType || 'Fiyat tipi belirtilmemiş'}
        </p>
      </div>

      <div className="mt-4 rounded-lg bg-white/10 p-3">
        <p className="text-sm text-blue-50">
          Bu fiyat, hizmet sağlayıcı tarafından belirlenmiştir ve pazarlığa açık
          olabilir.
        </p>
      </div>
    </motion.div>
  );
});

const ContactOptions = memo(function ContactOptions() {
  const [phon, setPhon] = useState('');
  const [em, setEm] = useState('');
  const [isContactVisible, setIsContactVisible] = useState(false);

  const fetchTeacherContact = async () => {
    try {
      const pathname = window.location.pathname;
      const pathSegments = pathname.split('/');
      const adId = pathSegments[pathSegments.length - 1];
      const getData = await contactTeacher(adId);
      if (getData?.data) {
        let phone = '';
        if (getData?.data.phone) {
          if (getData?.data.phone.startsWith('+90')) {
            phone = getData?.data.phone;
          } else if (getData?.data.phone.startsWith('+9')) {
            phone = '+90' + getData?.data.phone.slice(2);
          } else if (getData?.data.phone.startsWith('9')) {
            phone = '+90' + getData?.data.phone.slice(1);
          } else {
            phone = '+90' + getData?.data.phone;
          }
          setPhon(phone || 'Telefon bulunamadı');
          setEm(getData.data.mail || 'E-posta bulunamadı');
        } else {
          console.error('Telefon bilgisi mevcut değil.');
        }
      } else {
        console.error('Geçersiz veri yapısı:', getData);
      }
    } catch (error) {
      console.error('Hata oluştu:', error);
    }
  };

  useEffect(() => {
    fetchTeacherContact();
  }, []);

  const handleContact = async (type) => {
    const pathname = window.location.pathname;
    const pathSegments = pathname.split('/');
    const adId = pathSegments[pathSegments.length - 1];

    try {
      await logs(type, adId);
    } catch (error) {
      console.error('Error during contact action:', error);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5, x: 0 }}
      className="rounded-xl bg-white p-6 shadow-md transition-all hover:shadow-xl overflow-hidden"
    >
      <h3 className="mb-4 text-lg font-semibold text-gray-800">
        İletişim Seçenekleri
      </h3>

      {!isContactVisible ? (
        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsContactVisible(true)}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 p-4 text-white transition-all duration-300 hover:bg-blue-700"
        >
          <FaPhone className="h-5 w-5" />
          <span className="font-medium">İletişim Bilgilerini Göster</span>
        </motion.button>
      ) : (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-3"
        >
          <a
            onClick={() => handleContact('whatsapp')}
            href={`https://wa.me/${phon}`}
            className="group flex w-full items-center justify-center gap-2 rounded-lg bg-green-500 p-4 text-white transition-all duration-300 hover:bg-green-600"
          >
            <FaWhatsapp className="h-5 w-5 transition-transform group-hover:scale-110" />
            <span className="font-medium">WhatsApp ile İlet</span>
          </a>
          <a
            onClick={() => handleContact('phone')}
            href={`tel:${phon}`}
            className="group flex w-full items-center justify-center gap-2 rounded-lg bg-blue-500 p-4 text-white transition-all duration-300 hover:bg-blue-600"
          >
            <FaPhone className="h-5 w-5 transition-transform group-hover:scale-110" />
            <span className="font-medium">Telefon ile Ara</span>
          </a>
          <a
            onClick={() => handleContact('email')}
            href={`mailto:${em}`}
            className="group flex w-full items-center justify-center gap-2 rounded-lg bg-gray-500 p-4 text-white transition-all duration-300 hover:bg-gray-600"
          >
            <FaEnvelope className="h-5 w-5 transition-transform group-hover:scale-110" />
            <span className="font-medium">E-posta Gönder</span>
          </a>
        </motion.div>
      )}

      <div className="mt-4 rounded-lg bg-blue-50 p-3">
        <p className="text-sm text-blue-800">
          <FaCheckCircle className="mr-2 inline-block text-blue-600" />
          İletişim bilgileri gizlilik politikamız kapsamında korunmaktadır.
        </p>
      </div>
    </motion.div>
  );
});

const ImageModal = memo(function ImageModal({
  images,
  currentImageIndex,
  onClose,
  setCurrentImageIndex,
}) {
  if (!images || images.length === 0) return null;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="relative max-h-[90vh] max-w-[90vw]">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImageIndex}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            src={images[currentImageIndex] || '/placeholder.svg'}
            alt={`İlan Resmi ${currentImageIndex + 1}`}
            className="max-h-[90vh] max-w-[90vw] object-contain"
          />
        </AnimatePresence>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-sm text-white">
          {currentImageIndex + 1} / {images.length}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            prevImage();
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-3 text-white transition-all hover:bg-white/40"
        >
          <FaChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            nextImage();
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-3 text-white transition-all hover:bg-white/40"
        >
          <FaChevronRight className="h-6 w-6" />
        </button>

        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full bg-white/20 p-3 text-white transition-all hover:bg-white/40"
        >
          ✕
        </button>
      </div>
    </motion.div>
  );
});

const AdDetailHeader = memo(function AdDetailHeader({
  ad,
  favCounts,
  viewingCount,
  favoriBg,
  favoriTxt,
  favoriActions,
}) {
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 overflow-hidden rounded-xl bg-white p-6 shadow-md transition-all duration-300 hover:shadow-xl"
    >
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="flex-1">
          <h1 className="mb-2 text-2xl font-bold text-gray-800 md:text-3xl">
            {ad.title || 'Başlık bulunamadı'}
          </h1>
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center rounded-full bg-red-50 px-3 py-1 text-sm text-red-600">
              <FaHeart className="mr-2" /> {favCounts} Favori
            </span>
            <span className="flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-600">
              <FaEye className="mr-2" /> {viewingCount} Görüntülenme
            </span>
            <span className="flex items-center rounded-full bg-gray-50 px-3 py-1 text-sm text-gray-600">
              <FaRegCalendarAlt className="mr-2" />
              {formatDate(ad.createdAt) || 'Tarih belirtilmemiş'}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className={`group rounded-lg ${favoriBg} ${favoriTxt} p-3 text-gray-600 transition-all duration-300 hover:bg-red-500 hover:text-white`}
            onClick={favoriActions}
          >
            <FaHeart className="h-5 w-5" />
          </motion.button>
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="group rounded-lg bg-gray-100 p-3 text-gray-600 transition-all duration-300 hover:bg-blue-500 hover:text-white"
          >
            <FaShare className="h-5 w-5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
});

const AdSellerInfo = memo(function AdSellerInfo({ ad }) {
  return (
    <motion.div
      whileHover={{ y: -5, x: 0 }}
      className="rounded-xl bg-white p-6 shadow-md transition-all hover:shadow-xl overflow-hidden"
    >
      <h3 className="mb-4 text-lg font-semibold text-gray-800">
        Hizmet Sağlayıcı
      </h3>
      <div className="flex items-center">
        <div className="mr-4 h-16 w-16 overflow-hidden rounded-full bg-gray-100">
          <FaUserCircle className="h-full w-full text-gray-400" />
        </div>
        <div>
          <h4 className="text-lg font-medium text-gray-800">
            {ad.user?.name || 'İsim belirtilmemiş'}
          </h4>
          <p className="text-sm text-gray-500">
            <FaRegClock className="mr-1 inline" />{' '}
            {new Date(ad.user?.createdAt || Date.now()).getFullYear()} yılından
            beri üye
          </p>
        </div>
      </div>
      <div className="mt-4 rounded-lg bg-green-50 p-3">
        <p className="text-sm text-green-800">
          <FaCheckCircle className="mr-2 inline-block text-green-600" />
          Kimliği doğrulanmış hizmet sağlayıcı
        </p>
      </div>
    </motion.div>
  );
});

const MyAdsDetail = () => {
  const { adId } = useParams();
  const dispatch = useDispatch();
  const { selectedAd, singleAdStatus } = useSelector((state) => state.ads);
  const [favoriBg, setFavoriBg] = useState('bg-gray-100');
  const [favoriTxt, setFavoriTxt] = useState('text-gray-600');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isSidebarSticky, setIsSidebarSticky] = useState(false);
  const [viewingCount, setViewingCount] = useState(0);
  const [favCounts, setFavCount] = useState(0);

  const favIs = async () => {
    const isFavori = await favoriIs(adId);
    setFavoriBg(isFavori.data.success);

    if (isFavori.data.success === 'bg-red-500') setFavoriTxt('text-white');
    else {
      setFavoriTxt('text-gray-600');
    }

    const result = await countFav(adId);
    setFavCount(result.data.data);
  };

  const viewIs = async () => {
    const isView = await viewingIs(adId);
    setViewingCount(isView.data.data);

    const result = await countFav(adId);
    setFavCount(result.data.data);
  };

  useEffect(() => {
    favIs();
    dispatch(fetchSingleAd(adId));

    const handleScroll = () => {
      setIsSidebarSticky(window.scrollY > 200);
    };

    viewIs();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [dispatch, adId]);

  const favoriActions = async () => {
    await favoriAction(adId);
    await favIs();
  };

  if (singleAdStatus === 'loading') {
    return <LoadingSpinner message="İlan detayları yükleniyor" />;
  }

  if (!selectedAd || !selectedAd.data) {
    return <NotFound />;
  }

  const ad = selectedAd.data;

  const metaDescription = ad.description
    ? ad.description.substring(0, 160)
    : `${ad.title} - Detaylı bilgi için tıklayın.`;

  const metaKeywords = `${ad.title}, ${ad.category?.name || ''}, ${
    ad.subCategory?.name || ''
  }, ${ad.city || ''}, ${ad.serviceType || ''}`;

  const ogImage = ad.images && ad.images.length > 0 ? ad.images[0] : '';

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-4 md:p-8 overflow-x-hidden">
        <MetaHelmet
          title={ad.title}
          description={metaDescription}
          keywords={metaKeywords}
          ogImage={ogImage}
          ogType="product"
          canonical={`${window.location.origin}/dashboard/my-ads/${adId}`}
        />
        <Link
          to="/dashboard/my-ads"
          className="mb-6 inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <FaArrowLeft className="mr-2" /> İlanlarıma Dön
        </Link>

        <AdDetailHeader
          ad={ad}
          favCounts={favCounts}
          viewingCount={viewingCount}
          favoriBg={favoriBg}
          favoriTxt={favoriTxt}
          favoriActions={favoriActions}
        />

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            {ad.images && ad.images.length > 0 && (
              <ImageCarousel
                images={ad.images}
                currentIndex={currentImageIndex}
                setCurrentIndex={setCurrentImageIndex}
                onOpenModal={() => setIsImageModalOpen(true)}
              />
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-xl bg-white p-6 shadow-md transition-all hover:shadow-xl"
            >
              <h2 className="mb-4 text-xl font-semibold text-gray-800 flex items-center">
                <span className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <FaTag className="h-4 w-4" />
                </span>
                Detaylı Açıklama
              </h2>
              <p className="leading-relaxed text-gray-600 whitespace-pre-line">
                {ad.description || 'Açıklama mevcut değil'}
              </p>
            </motion.div>

            <div className="grid gap-4 sm:grid-cols-2">
              <InfoCard
                icon={<FaLayerGroup className="h-5 w-5" />}
                iconBgClass="bg-purple-100 text-purple-600 group-hover:bg-purple-600"
                label="Kategori"
                value={ad.category?.name || 'Belirtilmemiş'}
              />
              <InfoCard
                icon={<FaFolder className="h-5 w-5" />}
                iconBgClass="bg-indigo-100 text-indigo-600 group-hover:bg-indigo-600"
                label="Alt Kategori"
                value={ad.subCategory?.name || 'Belirtilmemiş'}
              />
              <InfoCard
                icon={<FaTag className="h-5 w-5" />}
                iconBgClass="bg-blue-100 text-blue-600 group-hover:bg-blue-600"
                label="Hizmet Tipi"
                value={ad.serviceType || 'Bilinmiyor'}
              />
              <InfoCard
                icon={<FaMapMarkerAlt className="h-5 w-5" />}
                iconBgClass="bg-green-100 text-green-600 group-hover:bg-green-600"
                label="Konum"
                value={ad.city?.name || 'Belirtilmemiş'}
              />

            </div>
          </div>

          <div
            className={
              isSidebarSticky ? 'lg:sticky lg:top-8 space-y-8' : 'space-y-8'
            }
          >
            <PriceCard price={ad.price} priceType={ad.priceType} />

            <AdSellerInfo ad={ad} />

            <ContactOptions />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="rounded-xl bg-white p-6 shadow-md hover:shadow-xl"
            >
              <h3 className="mb-4 text-lg font-semibold text-gray-800">
                Tüm Görseller
              </h3>
              <AllImagesPreview
                images={ad.images}
                onOpenModal={() => setIsImageModalOpen(true)}
                setCurrentImageIndex={setCurrentImageIndex}
              />
            </motion.div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isImageModalOpen && (
          <ImageModal
            images={ad.images}
            currentImageIndex={currentImageIndex}
            setCurrentImageIndex={setCurrentImageIndex}
            onClose={() => setIsImageModalOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default MyAdsDetail;
