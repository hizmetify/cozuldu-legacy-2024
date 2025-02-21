import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchUserAds, deleteAd } from '../../features/ad/adSlice';
import Spinner from '../../components/UI/Spinner';
import { FaRegTrashCan } from 'react-icons/fa6';
import { FaEdit, FaEye } from 'react-icons/fa';
import DeleteConfirmationModal from '../../components/UI/DeleteConfirmationModal'; 
import { emailSend } from '../../api/authApi';

const MyAdsList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    userAds,
    userAdsStatus: status,
    error,
  } = useSelector((state) => state.ads);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [adToDelete, setAdToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchUserAds());
  }, [dispatch]);

  const handleDeleteClick = (adId) => {
    setAdToDelete(adId);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (adToDelete) {
      await dispatch(deleteAd(adToDelete));
      setIsDeleteModalOpen(false);
      setAdToDelete(null);
    }
  };

  const handleCloseModal = () => {
    setIsDeleteModalOpen(false);
    setAdToDelete(null);
  };
  const sendMailVerification=async()=>{
    let response=await emailSend()
    if(response?.status=='success')
      navigate("/emailverify")
    else if (response?.status=='continue')
      navigate("/dashboard/my-ads/new")
  }
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-gray-50">
        <Spinner />
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div
        className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-md"
        role="alert"
      >
        <p className="font-bold">Hata</p>
        <p>{error}</p>
      </div>
    );
  }

  if (!userAds || userAds.length === 0) {
    return (
      <div className="text-center p-8 bg-white shadow-md rounded-lg">
        <p className="text-lg mb-4 text-gray-600">Henüz bir ilanınız yok.</p>
        <Link
          to="/dashboard/my-ads/new"
          className="mt-2 inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
        >
          + Yeni İlan Ekle
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-0">
            İlanlarım
          </h2>
          <Link
            onClick={sendMailVerification}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
          >
            + Yeni İlan Ekle
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Resim
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Başlık
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fiyat
                </th>
                <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {(Array.isArray(userAds?.data)
                ? userAds.data
                : userAds || []
              ).map((ad) => (
                <tr
                  key={ad._id}
                  className="hover:bg-gray-50 transition duration-150 ease-in-out"
                >
                  <td className="py-4 px-4">
                    <img
                      src={
                        ad.images?.length
                          ? ad.images[0]
                          : 'https://media.istockphoto.com/id/1324356458/tr/vekt%C3%B6r/picture-icon-photo-frame-symbol-landscape-sign-photograph-gallery-logo-web-interface-and.jpg?s=612x612&w=0&k=20&c=khO1-2i1TZ67Nak9JQWmDx7Slai72lbl6SEp2gDOaV8='
                      }
                      alt={ad.title}
                      className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-md shadow-sm"
                    />
                  </td>
                  <td className="py-4 px-4 text-sm md:text-base text-gray-900">
                    {ad.title}
                  </td>
                  <td className="py-4 px-4 text-sm md:text-base text-gray-900">
                    {ad.price ? `${ad.price}₺` : 'Fiyat Belirtilmedi'}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <Link
                      to={`/dashboard/my-ads/${ad._id}`}
                      className="text-blue-600 hover:text-blue-800 inline-block mx-2 transition duration-150 ease-in-out"
                      title="Görüntüle"
                    >
                      <FaEye className="text-xl" />
                    </Link>
                    <Link
                      to={`/dashboard/my-ads/${ad._id}/edit`}
                      className="text-green-600 hover:text-green-800 inline-block mx-2 transition duration-150 ease-in-out"
                      title="Düzenle"
                    >
                      <FaEdit className="text-xl" />
                    </Link>
                    <button
                      onClick={() => handleDeleteClick(ad._id)}
                      className="text-red-600 hover:text-red-800 mx-2 transition duration-150 ease-in-out"
                      title="Sil"
                    >
                      <FaRegTrashCan className="text-xl" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        title="Bu ilanı silmek istediğinize emin misiniz?"
      />
    </div>
  );
};

export default MyAdsList;
