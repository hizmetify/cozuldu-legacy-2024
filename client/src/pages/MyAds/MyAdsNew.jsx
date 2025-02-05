import { useState, useEffect } from 'react';
import { Formik, Form, Field, FieldArray } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { createAd } from '../../features/ad/adSlice';
import { useNavigate } from 'react-router-dom';
import Spinner from '../../components/UI/Spinner';
import { AdSchema } from '../../validations/adValidation';
import { fetchCities } from '../../api/cityApi';
import SelectField from '../../components/UI/SelectField';

const serviceTypeOptions = ['yüz yüze'];
const priceTypeOptions = ['saatlik', 'günlük', 'iş başı'];

const MyAdsNew = () => {
  const [cities, setCities] = useState([]);

  useEffect(() => {
    const loadCities = async () => {
      const cityData = await fetchCities();
      setCities(cityData);
    };
    loadCities();
  }, []);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.ads);

  const initialValues = {
    title: '',
    description: '',
    serviceType: 'yüz yüze',
    city: '',
    price: '',
    priceType: 'saatlik',
    availability: [''],
    images: [''],
  };

  const handleSubmit = async (values) => {
    const resultAction = await dispatch(createAd(values));
    if (createAd.fulfilled.match(resultAction)) {
      navigate('/dashboard/my-ads'); 
    }

  };

  return (
    <div className="p-4  bg-white shadow rounded-md">
      <h2 className="text-xl font-bold mb-4">Yeni İlan Ekle</h2>

      {status === 'loading' && (
        <div className="mb-4">
          <Spinner />
        </div>
      )}
      {status === 'failed' && (
        <div className="mb-4 p-2 bg-red-100 text-red-600 rounded">
          {error?.message || 'Bir hata oluştu'}
        </div>
      )}

      <Formik
        initialValues={initialValues}
        validationSchema={AdSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, setFieldValue }) => (
          <Form className="space-y-4">
            <div>
              <label htmlFor="title" className="block font-medium mb-1">
                Başlık <span className="text-red-500">*</span>
              </label>
              <Field
                name="title"
                id="title"
                className="w-full border border-gray-300 rounded p-2"
                placeholder="Örn: Matematik Özel Ders"
              />
              {errors.title && touched.title && (
                <div className="text-red-500 text-sm mt-1">{errors.title}</div>
              )}
            </div>
            <div>
              <label htmlFor="description" className="block font-medium mb-1">
                Açıklama <span className="text-red-500">*</span>
              </label>
              <Field
                as="textarea"
                rows={3}
                name="description"
                id="description"
                className="w-full border border-gray-300 rounded p-2"
                placeholder="Ders, hizmet veya ürünle ilgili detaylar"
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
                id="serviceType"
                className="w-full border border-gray-300 rounded p-2 bg-white"
              >
                <option value="">Seçiniz</option>
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
                Şehir
                {values.serviceType === 'yüz yüze' && (
                  <span className="text-red-500"> *</span>
                )}
              </label>
              <SelectField name={'city'} label={'Şehir'} options={cities} />
              {errors.city && touched.city && (
                <div className="text-red-500 text-sm mt-1">{errors.city}</div>
              )}
            </div>
            <div className="flex space-x-2">
              <div className="w-1/2">
                <label htmlFor="price" className="block font-medium mb-1">
                  Fiyat <span className="text-red-500">*</span>
                </label>
                <Field
                  name="price"
                  id="price"
                  type="number"
                  min="0"
                  className="w-full border border-gray-300 rounded p-2"
                />
                {errors.price && touched.price && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.price}
                  </div>
                )}
              </div>
              <div className="w-1/2">
                <label htmlFor="priceType" className="block font-medium mb-1">
                  Fiyat Tipi <span className="text-red-500">*</span>
                </label>
                <Field
                  as="select"
                  name="priceType"
                  id="priceType"
                  className="w-full border border-gray-300 rounded p-2 bg-white"
                >
                  <option value="">Seçiniz</option>
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
            </div>
            <div>
              <label className="block font-medium mb-1">
                Müsaitlik Tarihleri
              </label>
              <FieldArray name="availability">
                {({ remove, push }) => (
                  <div className="space-y-2">
                    {values.availability.map((dateVal, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <Field
                          name={`availability.${idx}`}
                          type="date"
                          className="border border-gray-300 rounded p-2"
                        />
                        <button
                          type="button"
                          className="text-red-600"
                          onClick={() => remove(idx)}
                        >
                          Sil
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="bg-blue-600 text-white px-3 py-1 rounded"
                      onClick={() => push('')}
                    >
                      Tarih Ekle
                    </button>
                  </div>
                )}
              </FieldArray>
              {errors.availability && (
                <div className="text-red-500 text-sm mt-1">
                  Tarih formatında değer girin
                </div>
              )}
            </div>

            <div>
              <label className="block font-medium mb-1">Resimler (URL)</label>
              <FieldArray name="images">
                {({ remove, push }) => (
                  <div className="space-y-2">
                    {values.images.map((imgVal, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <Field
                          name={`images.${idx}`}
                          type="text"
                          placeholder="https://example.com/image.jpg"
                          className="border border-gray-300 rounded p-2 w-full"
                        />
                        <button
                          type="button"
                          className="text-red-600"
                          onClick={() => remove(idx)}
                        >
                          Sil
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="bg-blue-600 text-white px-3 py-1 rounded"
                      onClick={() => push('')}
                    >
                      Yeni Resim
                    </button>
                  </div>
                )}
              </FieldArray>
              {errors.images && (
                <div className="text-red-500 text-sm mt-1">
                  Geçerli resim URL’si giriniz
                </div>
              )}
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition disabled:bg-gray-400"
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default MyAdsNew;
