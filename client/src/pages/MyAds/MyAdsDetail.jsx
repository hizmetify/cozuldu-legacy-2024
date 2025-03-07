import { useEffect, useState, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSingleAd } from '../../features/ad/adSlice';
import { useParams } from 'react-router-dom';
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
} from 'react-icons/fa';
const LoadingSpinner = () => (
  <div className="flex h-screen items-center justify-center">
    <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
  </div>
);

const NotFound = () => (
  <div className="flex h-screen items-center justify-center">
    <div className="rounded-lg bg-red-50 p-8 text-center">
      <h3 className="mb-2 text-xl font-semibold text-red-800">
        İlan Bulunamadı
      </h3>
      <p className="text-red-600">
        İstediğiniz ilan silinmiş veya yayından kaldırılmış olabilir.
      </p>
    </div>
  </div>
);

const InfoCard = memo(function InfoCard({ icon, iconBgClass, label, value }) {
  return (
    <div className="group rounded-xl bg-white p-5 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
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
    </div>
  );
});
const ImageCarousel = memo(function ImageCarousel({
  images,
  currentIndex,
  setCurrentIndex,
  onOpenModal,
}) {
  const nextImage = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow-lg transition-all hover:shadow-xl">
      <div className="relative aspect-video overflow-hidden rounded-lg">
        <img
          src={images[currentIndex] || '/placeholder.svg'}
          alt={`İlan Resmi ${currentIndex + 1}`}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <button
          onClick={prevImage}
          className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-all hover:bg-black/70"
        >
          <FaChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-all hover:bg-black/70"
        >
          <FaChevronRight className="h-5 w-5" />
        </button>
        <button
          onClick={onOpenModal}
          className="absolute right-4 top-4 rounded-full bg-black/50 p-2 text-white transition-all hover:bg-black/70"
        >
          <FaExpand className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
        {images.map((img, index) => (
          <button
            key={index}
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
          </button>
        ))}
      </div>
    </div>
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
    <div className="grid grid-cols-3 gap-2">
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
    <div className="rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white shadow-lg transition-all duration-300 hover:shadow-xl">
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
    </div>
  );
});

const ContactOptions = memo(function ContactOptions() {
  return (
    <div className="rounded-xl bg-white p-6 shadow-lg">
      <h3 className="mb-4 text-lg font-semibold text-gray-800">
        İletişim Seçenekleri
      </h3>
      <div className="space-y-3">
        <button className="group flex w-full items-center justify-center gap-2 rounded-lg bg-green-500 p-4 text-white transition-all duration-300 hover:bg-green-600">
          <FaWhatsapp className="h-5 w-5 transition-transform group-hover:scale-110" />
          <span className="font-medium">WhatsApp ile İlet</span>
        </button>
        <button className="group flex w-full items-center justify-center gap-2 rounded-lg bg-blue-500 p-4 text-white transition-all duration-300 hover:bg-blue-600">
          <FaPhone className="h-5 w-5 transition-transform group-hover:scale-110" />
          <span className="font-medium">Telefon ile Ara</span>
        </button>
        <button className="group flex w-full items-center justify-center gap-2 rounded-lg bg-gray-500 p-4 text-white transition-all duration-300 hover:bg-gray-600">
          <FaEnvelope className="h-5 w-5 transition-transform group-hover:scale-110" />
          <span className="font-medium">E-posta Gönder</span>
        </button>
      </div>
    </div>
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
      onClick={onClose}
    >
      <div className="relative max-h-[90vh] max-w-[90vw]">
        <img
          src={images[currentImageIndex] || '/placeholder.svg'}
          alt={`İlan Resmi ${currentImageIndex + 1}`}
          className="max-h-[90vh] max-w-[90vw] object-contain"
        />
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
      </div>
    </div>
  );
});

const MyAdsDetail = () => {
  const { adId } = useParams();
  const dispatch = useDispatch();
  const { selectedAd, singleAdStatus } = useSelector((state) => state.ads);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isSidebarSticky, setIsSidebarSticky] = useState(false);

  useEffect(() => {
    dispatch(fetchSingleAd(adId));
    const handleScroll = () => {
      setIsSidebarSticky(window.scrollY > 200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [dispatch, adId]);

  if (singleAdStatus === 'loading') {
    return <LoadingSpinner />;
  }

  if (!selectedAd || !selectedAd.data) {
    return <NotFound />;
  }

  const ad = selectedAd.data;

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 overflow-hidden rounded-xl bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div className="flex-1">
              <h1 className="mb-2 text-2xl font-bold text-gray-800 md:text-3xl">
                {ad.title || 'Başlık bulunamadı'}
              </h1>
              <div className="flex flex-wrap items-center gap-4">
                <span className="flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700">
                  <FaEye className="mr-2" /> 245 Görüntülenme
                </span>
                <span className="flex items-center text-sm text-gray-500">
                  <FaClock className="mr-2" />
                  {formatDate(ad.createdAt) || 'Tarih belirtilmemiş'}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="group rounded-lg bg-gray-100 p-3 text-gray-600 transition-all duration-300 hover:bg-red-500 hover:text-white">
                <FaHeart className="h-5 w-5 transition-transform group-hover:scale-110" />
              </button>
              <button className="group rounded-lg bg-gray-100 p-3 text-gray-600 transition-all duration-300 hover:bg-blue-500 hover:text-white">
                <FaShare className="h-5 w-5 transition-transform group-hover:scale-110" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {ad.images && ad.images.length > 0 && (
              <ImageCarousel
                images={ad.images}
                currentIndex={currentImageIndex}
                setCurrentIndex={setCurrentImageIndex}
                onOpenModal={() => setIsImageModalOpen(true)}
              />
            )}
            <div className="rounded-xl bg-white p-6 shadow-lg transition-all hover:shadow-xl">
              <h2 className="mb-4 text-xl font-semibold text-gray-800">
                Detaylı Açıklama
              </h2>
              <p className="leading-relaxed text-gray-600 whitespace-pre-line">
                {ad.description || 'Açıklama mevcut değil'}
              </p>
            </div>

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
                value={ad.city || 'Belirtilmemiş'}
              />
            </div>
          </div>
          <div
            className={
              isSidebarSticky ? 'lg:sticky lg:top-6 space-y-6' : 'space-y-6'
            }
          >
            <PriceCard price={ad.price} priceType={ad.priceType} />

            <ContactOptions />

            <div className="rounded-xl bg-white p-6 shadow-lg">
              <h3 className="mb-4 text-lg font-semibold text-gray-800">
                Tüm Görseller
              </h3>
              <AllImagesPreview
                images={ad.images}
                onOpenModal={() => setIsImageModalOpen(true)}
                setCurrentImageIndex={setCurrentImageIndex}
              />
            </div>
          </div>
        </div>
      </div>
      {isImageModalOpen && (
        <ImageModal
          images={ad.images}
          currentImageIndex={currentImageIndex}
          setCurrentImageIndex={setCurrentImageIndex}
          onClose={() => setIsImageModalOpen(false)}
        />
      )}
    </div>
  );
};

export default MyAdsDetail;
