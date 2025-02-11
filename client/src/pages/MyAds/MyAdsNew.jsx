import { useState, useEffect } from 'react';
import { Formik, Form, Field} from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { createAd } from '../../features/ad/adSlice';
import { useNavigate } from 'react-router-dom';
import Spinner from '../../components/UI/Spinner';
import { AdSchema } from '../../validations/adValidation';
import { fetchCities } from '../../api/cityApi';
import SelectField from '../../components/UI/SelectField';
import { showToast } from '../../features/toast/toastSlice';

const serviceTypeOptions = ['yüz yüze'];
const priceTypeOptions = ['saatlik', 'günlük', 'iş başı'];

const MyAdsNew = () => {
  const [cities, setCities] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  useEffect(() => {
    const loadCities = async () => {
      const cityData = await fetchCities();
      setCities(cityData);
    };
    loadCities();
  }, []);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status } = useSelector((state) => state.ads);

  const initialValues = {
    title: '',
    description: '',
    serviceType: 'yüz yüze',
    city: '',
    price: '',
    priceType: 'saatlik',
  };

  const handleFileChange = (e) => {
    setSelectedFiles([...e.target.files]);
  };

  const handleSubmit = async (values, { setErrors }) => {
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((item) => formData.append(key, item));
        } else {
          formData.append(key, value);
        }
      });
      selectedFiles.forEach((file) => {
        formData.append('images', file);
      });

      await dispatch(createAd(formData)).unwrap();

      dispatch(
        showToast({ message: 'İlan başarıyla eklendi!', type: 'success' })
      );
      navigate('/dashboard/my-ads');
    } catch (error) {
      dispatch(showToast({ message: error, type: 'error' }));

      if (typeof error === 'object' && error.errors) {
        setErrors(error.errors);
      }
    }
  };

  return (
    <div className="p-4 bg-white shadow rounded-md">
      <h2 className="text-xl font-bold mb-4">Yeni İlan Ekle</h2>
      {status === 'loading' && (
        <div className="mb-4">
          <Spinner />
        </div>
      )}
      <Formik
        initialValues={initialValues}
        validationSchema={AdSchema}
        validateOnChange={false}
        validateOnBlur={false}
        onSubmit={handleSubmit}
      >
        {({
          validateForm,
          handleSubmit,
          setErrors,
          values,
          errors,
          touched,
        }) => {
          const customSubmit = async (e) => {
            if (e) e.preventDefault();
            const validationErrors = await validateForm();

            if (Object.keys(validationErrors).length > 0) {
              setErrors(validationErrors);
              Object.values(validationErrors).forEach((errorMsg) => {
                dispatch(showToast({ message: errorMsg, type: 'error' }));
              });
            } else {
              await handleSubmit();
            }
          };
          return (
            <Form className="space-y-4">
              <div>
                <label htmlFor="title" className="block font-medium mb-1">
                  Başlık <span className="text-red-500">*</span>
                </label>
                <Field
                  name="title"
                  className="w-full border border-gray-300 rounded p-2"
                />
                {errors.title && touched.title && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.title}
                  </div>
                )}
              </div>
              <div>
                <label htmlFor="description" className="block font-medium mb-1">
                  Açıklama <span className="text-red-500">*</span>
                </label>
                <Field
                  as="textarea"
                  name="description"
                  rows={3}
                  className="w-full border border-gray-300 rounded p-2"
                />
                {errors.description && touched.description && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.description}
                  </div>
                )}
              </div>
              <div>
                <label htmlFor="serviceType" className="block font-medium mb-1">
                  Hizmet Tipi <span className="text-red-500">*</span>
                </label>
                <Field
                  as="select"
                  name="serviceType"
                  className="w-full border border-gray-300 rounded p-2"
                >
                  {serviceTypeOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </Field>
                {errors.serviceType && touched.serviceType && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.serviceType}
                  </div>
                )}
              </div>
              <div>
                <label htmlFor="city" className="block font-medium mb-1">
                  Şehir <span className="text-red-500">*</span>
                </label>
                <SelectField name="city" label="Şehir" options={cities} />
                {errors.city && touched.city && (
                  <div className="text-red-500 text-sm mt-1">{errors.city}</div>
                )}
              </div>
              <div>
                <label htmlFor="price" className="block font-medium mb-1">
                  Fiyat <span className="text-red-500">*</span>
                </label>
                <Field
                  name="price"
                  id="price"
                  type="number"
                  className="w-full border border-gray-300 rounded p-2"
                />
                {errors.price && touched.price && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.price}
                  </div>
                )}
              </div>
              <div>
                <label htmlFor="priceType" className="block font-medium mb-1">
                  Fiyat Tipi <span className="text-red-500">*</span>
                </label>
                <Field
                  as="select"
                  name="priceType"
                  className="w-full border border-gray-300 rounded p-2"
                >
                  {priceTypeOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </Field>
                {errors.priceType && touched.priceType && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.priceType}
                  </div>
                )}
              </div>
              <div>
                <label className="block font-medium mb-1">Resimler</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full border border-gray-300 rounded p-2"
                />
                {selectedFiles.length > 0 && (
                  <p className="text-sm text-gray-600 mt-1">
                    Seçilen Dosyalar:{' '}
                    {selectedFiles.map((f) => f.name).join(', ')}
                  </p>
                )}
              </div>
              <div className="pt-4">
                <button
                  type="submit"
                  onClick={customSubmit}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition disabled:bg-gray-400"
                >
                  {status === 'loading' ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default MyAdsNew;
