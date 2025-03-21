import { useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { updateAd, fetchSingleAd } from '../../features/ad/adSlice';
import { useNavigate, useParams } from 'react-router-dom';

import LoadingSpinner from '../../components/UI/LoadingSpinner';
import { AdSchema } from '../../validations/adValidation';
import { fetchCities } from '../../api/cityApi';
import SelectField from '../../components/UI/SelectField';
import InputField from '../../components/UI/InputField';
import { showToast } from '../../features/toast/toastSlice';
import { FiUpload } from 'react-icons/fi';

const serviceTypeOptions = ['yüz yüze'];
const priceTypeOptions = ['saatlik', 'günlük', 'iş başı'];

const MyAdsEdit = () => {
  const { adId } = useParams();
  const [cities, setCities] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedAd, singleAdStatus } = useSelector((state) => state.ads);

  useEffect(() => {
    const fetchAdData = async () => {
      dispatch(fetchSingleAd(adId));
      const cityData = await fetchCities();
      setCities(cityData);
    };
    fetchAdData();
  }, [dispatch, adId]);

  if (singleAdStatus === 'loading' || !selectedAd) return <LoadingSpinner />;

  const ad = selectedAd.data;

  const initialValues = {
    title: ad.title,
    description: ad.description,
    serviceType: ad.serviceType,
    city: ad.city,
    price: ad.price,
    priceType: ad.priceType,
  };

  const handleFileChange = (e) => setSelectedFiles([...e.target.files]);

  const handleSubmit = async (values, { setErrors }) => {
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) =>
        formData.append(key, value)
      );
      selectedFiles.forEach((file) => formData.append('images', file));
      await dispatch(updateAd({ adId, adData: formData })).unwrap();
      dispatch(
        showToast({ message: 'İlan başarıyla güncellendi!', type: 'success' })
      );
      navigate('/dashboard/my-ads');
    } catch (error) {
      dispatch(
        showToast({
          message: error.message || 'Bir hata oluştu',
          type: 'error',
        })
      );
      if (error.errors) setErrors(error.errors);
    }
  };

  return (
    <div className="max-w-3xl lg:max-w-none mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">İlanı Düzenle</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={AdSchema}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {({ handleSubmit }) => (
          <Form className="space-y-6">
            <InputField
              label="Başlık *"
              name="title"
              defaultValue={selectedAd.title}
            />
            <InputField
              label="Açıklama *"
              name="description"
              type="textarea"
              defaultValue={selectedAd.description}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectField
                label="Hizmet Tipi *"
                name="serviceType"
                options={serviceTypeOptions.map((opt) => ({ name: opt }))}
                defaultValue={selectedAd.serviceType}
              />
              <SelectField
                label="Şehir *"
                name="city"
                options={cities}
                defaultValue={selectedAd.city}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Fiyat *"
                name="price"
                type="number"
                defaultValue={selectedAd.price}
              />
              <SelectField
                label="Fiyat Tipi *"
                name="priceType"
                options={priceTypeOptions.map((opt) => ({ name: opt }))}
                defaultValue={selectedAd.priceType}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resimler
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                    >
                      <span>Dosya yükle</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        multiple
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </label>
                    <p className="pl-1">veya sürükleyip bırakın</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>
            </div>
            <div className="pt-4">
              <button
                type="submit"
                onClick={handleSubmit}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 ease-in-out"
              >
                Güncelle
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default MyAdsEdit;
