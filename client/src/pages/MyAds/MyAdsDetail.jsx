import { useEffect } from 'react';
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
} from 'react-icons/fa';

const MyAdsDetail = () => {
  const { adId } = useParams();
  const dispatch = useDispatch();
  const { selectedAd, singleAdStatus } = useSelector((state) => state.ads);

  useEffect(() => {
    dispatch(fetchSingleAd(adId));
  }, [dispatch, adId]);

  if (singleAdStatus === 'loading') {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  if (!selectedAd || !selectedAd.data) {
    return (
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
  }

  const ad = selectedAd.data;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 overflow-hidden rounded-xl bg-white p-6 shadow-lg transition-all hover:shadow-xl">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="mb-2 text-2xl font-bold text-gray-800 md:text-3xl">
                {ad.title || 'Başlık bulunamadı'}
              </h1>
              <div className="flex flex-wrap items-center gap-4">
                <span className="flex items-center text-sm text-gray-500">
                  <FaEye className="mr-2" /> 245 Görüntülenme
                </span>
                <span className="flex items-center text-sm text-gray-500">
                  <FaClock className="mr-2" />{' '}
                  {ad.createdAt || 'Tarih belirtilmemiş'}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="rounded-lg bg-gray-100 p-2 text-gray-600 transition-colors hover:bg-gray-200">
                <FaHeart className="h-5 w-5" />
              </button>
              <button className="rounded-lg bg-gray-100 p-2 text-gray-600 transition-colors hover:bg-gray-200">
                <FaShare className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-xl bg-white p-6 shadow-lg transition-all hover:shadow-xl">
              <h2 className="mb-4 text-xl font-semibold text-gray-800">
                Detaylı Açıklama
              </h2>
              <p className="leading-relaxed text-gray-600">
                {ad.description || 'Açıklama mevcut değil'}
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="group rounded-xl bg-white p-5 shadow-lg transition-all hover:shadow-xl">
                <div className="mb-3 flex items-center gap-3">
                  <div className="rounded-full bg-blue-100 p-3 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <FaTag className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Hizmet Tipi</p>
                    <p className="font-semibold text-gray-800">
                      {ad.serviceType || 'Bilinmiyor'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="group rounded-xl bg-white p-5 shadow-lg transition-all hover:shadow-xl">
                <div className="mb-3 flex items-center gap-3">
                  <div className="rounded-full bg-green-100 p-3 text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
                    <FaMapMarkerAlt className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Konum</p>
                    <p className="font-semibold text-gray-800">
                      {ad.city || 'Belirtilmemiş'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white shadow-lg">
              <h3 className="mb-2 text-lg font-semibold">Fiyatlandırma</h3>
              <div className="mb-4">
                <p className="text-3xl font-bold">
                  {ad.price ? `${ad.price} ₺` : 'Fiyat belirtilmemiş'}
                </p>
                <p className="flex items-center text-blue-100">
                  <FaClock className="mr-2" />
                  {ad.priceType || 'Fiyat tipi belirtilmemiş'}
                </p>
              </div>
            </div>

            {/* İletişim Kartı */}
            <div className="rounded-xl bg-white p-6 shadow-lg">
              <h3 className="mb-4 text-lg font-semibold text-gray-800">
                İletişim Seçenekleri
              </h3>
              <div className="space-y-3">
                <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-500 py-3 text-white transition-colors hover:bg-green-600">
                  <FaWhatsapp className="h-5 w-5" />
                  WhatsApp ile İlet
                </button>
                <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-500 py-3 text-white transition-colors hover:bg-blue-600">
                  <FaPhone className="h-5 w-5" />
                  Telefon ile Ara
                </button>
                <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-500 py-3 text-white transition-colors hover:bg-gray-600">
                  <FaEnvelope className="h-5 w-5" />
                  E-posta Gönder
                </button>
              </div>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-lg">
              <h3 className="mb-4 text-lg font-semibold text-gray-800">
                Görseller
              </h3>
              {ad.images && Array.isArray(ad.images) && ad.images.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {ad.images.map((img, index) => (
                    <div
                      key={index}
                      className="group relative aspect-square overflow-hidden rounded-lg"
                    >
                      <img
                        src={img || '/placeholder.svg'}
                        alt={`İlan Resmi ${index + 1}`}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex h-48 items-center justify-center rounded-lg bg-gray-100">
                  <p className="text-gray-500">Resim bulunamadı.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAdsDetail;
