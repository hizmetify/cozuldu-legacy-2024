import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchUserAds, deleteAd } from '../../features/ad/adSlice';
import Spinner from '../../components/UI/Spinner';

const MyAdsList = () => {
  const dispatch = useDispatch();
  const { userAds, status, error } = useSelector((state) => state.ads);

  useEffect(() => {
    dispatch(fetchUserAds());
  }, [dispatch]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center w-full">
        <Spinner />
      </div>
    );
  }

  if (status === 'failed') {
    return <div className="bg-red-500 p-4 text-white">error</div>;
  }

  if (!userAds || userAds.length === 0) {
    return (
      <div className="text-center p-4">
        <p>Henüz bir ilanınız yok.</p>
        <Link
          to="/dashboard/my-ads/new"
          className="mt-2 inline-block bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Yeni İlan Ekle
        </Link>
      </div>
    );
  }

  const handleDelete = (adId) => {
    if (window.confirm('Bu ilanı silmek istediğinize emin misiniz?')) {
      dispatch(deleteAd(adId));
    }
  };
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">İlanlarım</h2>
        <Link
          to="/dashboard/my-ads/new"
          className="bg-gradient-to-r from-blue-800 via-blue-500 to-blue-800 text-white px-4 py-2 rounded-sm"
        >
          + Yeni İlan Ekle
        </Link>
      </div>
      <table className="min-w-full bg-white rounded overflow-hidden">
        <thead className="bg-white border-b border-neutral-200">
          <tr>
            <th className="py-2 px-4 text-left">Resim</th>
            <th className="py-2 px-4 text-left">Başlık</th>
            <th className="py-2 px-4 text-left">Fiyat</th>
            <th className="py-2 px-4 text-center">İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {userAds.data.map((ad) => (
            <tr key={ad._id} className="border-b">
              <td className="py-2 px-4">
                <img
                  src={ad.images?.[0] || 'https://via.placeholder.com/100'}
                  alt={ad.title}
                  className="w-20 h-20 object-cover rounded"
                />
              </td>
              <td className="py-2 px-4">{ad.title}</td>
              <td className="py-2 px-4">
                {ad.price ? `${ad.price}₺` : 'Fiyat Belirtilmedi'}
              </td>
              <td className="py-2 px-4 text-center">
                <Link
                  to={`/dashboard/my-ads/${ad._id}`}
                  className="text-blue-600 hover:underline mx-2"
                >
                  Görüntüle
                </Link>
                <Link
                  to={`/dashboard/my-ads/${ad._id}/edit`}
                  className="text-green-600 hover:underline mx-2"
                >
                  Düzenle
                </Link>
                <button
                  onClick={() => handleDelete(ad._id)}
                  className="text-red-600 hover:underline mx-2"
                >
                  Sil
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyAdsList;
