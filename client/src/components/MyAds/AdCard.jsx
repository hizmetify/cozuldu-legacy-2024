import { memo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaEye, FaEdit } from 'react-icons/fa';
import { FaRegTrashCan } from 'react-icons/fa6';
import {
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiEye,
  FiEyeOff,
  FiMapPin,
  FiStar,
} from 'react-icons/fi';

export const AdStatusBadge = ({ status }) => {
  const statusConfig = {
    active: {
      color: 'bg-green-100 text-green-900',
      icon: <FiCheckCircle className="mr-1" />,
    },
    pending: {
      color: 'bg-yellow-100 text-yellow-900',
      icon: <FiClock className="mr-1" />,
    },
    pasif: {
      color: 'bg-red-100 text-red-900',
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

const LoadingSpinner = () => (
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
);

const CardContent = ({
  ad,
  isManageable,
  isFeatured,
  showLocation,
  showDate,
  onView,
  onEdit,
  onDelete,
  changeStatus,
  isLoading,
}) => (
  <>
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

      {isManageable && (
        <div className="absolute top-2 right-2">
          <AdStatusBadge status={ad.status} />
        </div>
      )}

      {isFeatured && ad.featured && (
        <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded">
          <FiStar className="inline mr-1" />
          Öne Çıkan
        </div>
      )}
    </div>
    <div className="p-5">
      <h3 className="font-bold text-lg text-gray-900 line-clamp-1 mb-2">
        {ad.title}
      </h3>
      <p className="text-gray-700 text-sm line-clamp-2 mb-3">
        {ad.description || 'Açıklama bulunmuyor'}
      </p>
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-700">
          {ad.priceType || 'saatlik'}
        </span>
        <span className="text-lg font-bold text-blue-600">
          {ad.price ? `${ad.price}₺` : 'Fiyat Belirtilmedi'}
        </span>
      </div>
    </div>

    {(showLocation || showDate) && (
      <div className="border-t border-gray-100 p-4 bg-gray-50">
        <div className="flex justify-between text-xs text-gray-700">
          {showLocation && (
            <div className="flex items-center">
              <FiMapPin className="mr-1" />
              {ad.city?.name || 'Konum belirtilmedi'}
            </div>
          )}
          {showDate && (
            <div className="flex items-center">
              <FiClock className="mr-1" />
              {new Date(ad.createdAt).toLocaleDateString('tr-TR')}
            </div>
          )}
        </div>
      </div>
    )}

    {isManageable && (
      <>
        <div
          className="border-t border-gray-100 p-4 bg-gray-50"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onView && onView(ad._id);
              }}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
              title="Görüntüle"
            >
              <FaEye />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit && onEdit(ad._id);
              }}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
              title="Düzenle"
            >
              <FaEdit />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete && onDelete(ad._id);
              }}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
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
              changeStatus && changeStatus(ad._id, ad.status);
            }}
            disabled={isLoading}
            className={`w-full py-2.5 rounded-md flex items-center justify-center gap-2 text-sm font-medium transition-all duration-200 ${
              isLoading
                ? 'bg-gray-100 text-gray-600 cursor-not-allowed'
                : ad.status === 'active'
                ? 'bg-red-100 text-red-800 hover:bg-red-200 border border-red-200 hover:border-red-300 hover:shadow-md'
                : 'bg-green-100 text-green-800 hover:bg-green-200 border border-green-200 hover:border-green-300 hover:shadow-md'
            }`}
          >
            {isLoading ? (
              <LoadingSpinner />
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
      </>
    )}
  </>
);

const AdCard = ({
  ad,
  onView,
  onEdit,
  onDelete,
  changeStatus,
  isLoading,
  isManageable = true,
  isFeatured = false,
  showLocation = false,
  showDate = false,
  linkTo = null,
}) => {
  const motionProps = {
    layout: true,
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
    whileHover: { y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' },
    transition: { duration: 0.2 },
  };
  if (linkTo) {
    return (
      <Link to={linkTo} className="block">
        <motion.div
          {...motionProps}
          className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
        >
          <CardContent
            ad={ad}
            isManageable={isManageable}
            isFeatured={isFeatured}
            showLocation={showLocation}
            showDate={showDate}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
            changeStatus={changeStatus}
            isLoading={isLoading}
          />
        </motion.div>
      </Link>
    );
  }
  return (
    <motion.div
      {...motionProps}
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
      onClick={() => onView && onView(ad._id)}
    >
      <CardContent
        ad={ad}
        isManageable={isManageable}
        isFeatured={isFeatured}
        showLocation={showLocation}
        showDate={showDate}
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
        changeStatus={changeStatus}
        isLoading={isLoading}
      />
    </motion.div>
  );
};

export default memo(AdCard);
