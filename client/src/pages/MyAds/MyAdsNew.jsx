import { useState, useEffect, useRef } from 'react';
import { Formik, Form, Field } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { createAd } from '../../features/ad/adSlice';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import {
  step1Schema,
  step2Schema,
  fullAdSchema,
} from '../../validations/adValidation';
import { fetchCities } from '../../api/cityApi';
import {
  fetchAddSubcategoryByCategory,
  fetchCategories,
  fetchSubCategories,
} from '../../api/categoryApi';
import SelectField from '../../components/UI/SelectField';
import InputField from '../../components/UI/InputField';
import { showToast } from '../../features/toast/toastSlice';
import {
  FiImage,
  FiArrowLeft,
  FiSave,
  FiInfo,
  FiMapPin,
  FiTag,
  FiDollarSign,
  FiList,
  FiGrid,
  FiMessageSquare,
  FiPlus,
  FiCheckCircle,
  FiEdit,
} from 'react-icons/fi';
import UploadFile from '../../components/MyAds/UploadFile';
import MetaHelmet from '../../utils/MetaHelmet';

const serviceTypeOptions = [
  { name: 'Yüz Yüze', value: 'yüz yüze' },
  { name: 'Online', value: 'online' },
];

const priceTypeOptions = [
  { name: 'Saatlik', value: 'saatlik' },
  { name: 'Günlük', value: 'günlük' },
  { name: 'İş Başı', value: 'iş başı' },
];

const MyAdsNew = () => {
  const [cities, setCities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [previewUrls, setPreviewUrls] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status } = useSelector((state) => state.ads);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [cityData, categoryData] = await Promise.all([
          fetchCities(),
          fetchCategories(),
        ]);
        const mappedCities = cityData.map((c) => ({
          name: c.name,
          value: c._id,
        }));

        const mappedCategories = categoryData.map((cat) => ({
          name: cat.name,
          value: cat._id,
        }));

        setCities(mappedCities);
        setCategories(mappedCategories);
      } catch (error) {
        console.error('Hata:', error);
      }
    };

    loadInitialData();
  }, []);

  useEffect(() => {
    const newPreviewUrls = selectedFiles.map((file) =>
      URL.createObjectURL(file)
    );
    setPreviewUrls(newPreviewUrls);

    return () => {
      newPreviewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [selectedFiles]);

  const handleCategoryChange = async (categoryId, setFieldValue) => {
    if (!categoryId || categoryId.length < 24) {
      setSubCategories([]);
      setFieldValue('subCategory', '');
      return;
    }

    setSelectedCategory(categoryId);
    setFieldValue('category', categoryId);
    setFieldValue('subCategory', '');

    try {
      const subCategoryData = await fetchSubCategories(categoryId);
      const mappedSubs = subCategoryData.map((sub) => ({
        name: sub.name,
        value: sub._id,
      }));
      setSubCategories(mappedSubs);
    } catch (error) {
      dispatch(
        showToast({
          message: 'Alt kategoriler yüklenirken bir hata oluştu',
          type: 'error',
        })
      );
      setSubCategories([]);
    }
  };

  const otherSubCategoryId = (subCatValue) => {
    const otherObj = subCategories.find((item) => item.name === 'Diğer');
    if (otherObj && otherObj.value === subCatValue) {
      setSelectedSubCategory('Diğer');
    } else {
      setSelectedSubCategory('Other');
    }
  };

  const initialValues = {
    title: '',
    description: '',
    serviceType: '',
    category: '',
    subCategory: '',
    customSubCategory: '',
    city: '',
    price: '',
    priceType: '',
  };

  const handleSubmit = async (values, { setErrors }) => {
    try {
      if (selectedFiles.length === 0) {
        dispatch(
          showToast({
            message: 'En az bir görsel yüklemelisiniz',
            type: 'error',
          })
        );
        return;
      }

      if (selectedSubCategory === 'Diğer') {
        const addSubCategoryByCategoryClient =
          await fetchAddSubcategoryByCategory({
            subCategory: values['subCategory'],
            category: values['category'],
            name: values['customSubCategory'],
          });
        Object.assign(values, {
          subCategory: addSubCategoryByCategoryClient.data,
        });
      }

      delete values.customSubCategory;

      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value);
      });
      selectedFiles.forEach((file) => {
        formData.append('images', file);
      });

      await dispatch(createAd(formData)).unwrap();

      dispatch(
        showToast({
          message: 'İlan başarıyla eklendi!',
          type: 'success',
        })
      );
      navigate('/dashboard/my-ads');
    } catch (error) {
      console.error('API Hatası:', error);
      console.error('Hata Detayları:', {
        message: error.message,
        data: error.response?.data,
      });

      dispatch(
        showToast({
          message: error.message || 'Bir hata oluştu',
          type: 'error',
        })
      );
      if (error.errors) {
        setErrors(error.errors);
      }
    }
  };

  const renderLabel = (text, icon = null) => {
    if (text.includes('*')) {
      const parts = text.split('*');
      return (
        <div className="flex items-center">
          {icon && <span className="mr-2 text-indigo-600">{icon}</span>}
          {parts[0]}
          <span className="text-red-600 font-bold">*</span>
        </div>
      );
    }
    return (
      <div className="flex items-center">
        {icon && <span className="mr-2 text-indigo-600">{icon}</span>}
        {text}
      </div>
    );
  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
    window.scrollTo(0, 0);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo(0, 0);
  };

  const stepInfo = [
    {
      title: 'Temel Bilgiler',
      description: 'İlanınızın başlık ve açıklamasını girin',
      icon: <FiEdit />,
    },
    {
      title: 'Kategori ve Fiyat',
      description: 'Hizmet kategorisi ve fiyat bilgilerini belirleyin',
      icon: <FiTag />,
    },
    {
      title: 'Görseller ve Tamamlama',
      description: 'İlanınız için görseller ekleyin ve yayınlayın',
      icon: <FiImage />,
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <MetaHelmet
        title="Yeni İlan Oluştur"
        description="Hizmetlerinizi potansiyel müşterilerinize tanıtmak için yeni bir ilan oluşturun."
        keywords="yeni ilan, ilan oluştur, hizmet ilanı, ilan yayınla"
        canonical={`${window.location.origin}/dashboard/my-ads/new`}
      />
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-blue-600 opacity-90"></div>
        <div className="relative px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center">
                <div className="bg-white bg-opacity-20 p-3 rounded-full mr-4">
                  <FiPlus className="text-white text-xl" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white">
                    Yeni İlan Oluştur
                  </h1>
                  <p className="text-indigo-100 mt-1">
                    Hizmetlerinizi potansiyel müşterilerinize tanıtın
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2 md:space-x-4">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`flex items-center ${
                    currentStep === step ? 'text-white' : 'text-indigo-200'
                  }`}
                >
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                      currentStep === step
                        ? 'bg-white bg-opacity-20 border-white'
                        : currentStep > step
                        ? 'bg-green-500 border-green-500'
                        : 'border-indigo-300 bg-transparent'
                    }`}
                  >
                    {currentStep > step ? (
                      <FiCheckCircle className="text-white" />
                    ) : (
                      <span className="font-medium">{step}</span>
                    )}
                  </div>
                  {step < 3 && (
                    <div
                      className={`w-6 md:w-10 h-0.5 mx-1 ${
                        currentStep > step
                          ? 'bg-green-500'
                          : 'bg-indigo-300 bg-opacity-50'
                      }`}
                    ></div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6 bg-white bg-opacity-10 rounded-lg p-4">
            <div className="flex items-center">
              {stepInfo[currentStep - 1].icon}
              <div className="ml-3">
                <h3 className="text-white font-medium">
                  {stepInfo[currentStep - 1].title}
                </h3>
                <p className="text-indigo-100 text-sm">
                  {stepInfo[currentStep - 1].description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="px-6 pt-6">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-medium text-indigo-700">
            Adım {currentStep} / 3
          </div>
          <div className="text-sm text-gray-500">
            {currentStep === 1
              ? 'Temel Bilgiler'
              : currentStep === 2
              ? 'Kategori ve Fiyat'
              : 'Görseller ve Tamamlama'}
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500 ease-in-out"
            style={{ width: `${(currentStep / 3) * 100}%` }}
          ></div>
        </div>
      </div>

      {status === 'loading' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl flex flex-col items-center">
            <LoadingSpinner />
            <p className="mt-4 text-gray-700 font-medium">
              İlanınız kaydediliyor...
            </p>
          </div>
        </div>
      )}

      <Formik
        initialValues={initialValues}
        validationSchema={fullAdSchema}
        validateOnChange={false}
        validateOnBlur={false}
        onSubmit={handleSubmit}
      >
        {({
          validateForm,
          handleSubmit,
          setErrors,
          setFieldValue,
          values,
          errors,
          touched,
        }) => {
          const customSubmit = async (e) => {
            e.preventDefault();
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
            <Form className="p-6">
              {currentStep === 1 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100 mb-6">
                    <h3 className="text-lg font-medium text-indigo-800 flex items-center mb-2">
                      <FiInfo className="mr-2" /> Temel Bilgiler
                    </h3>
                    <p className="text-sm text-indigo-700">
                      İlanınızın başlığı ve açıklaması, potansiyel müşterilerin
                      ilk göreceği bilgilerdir. Detaylı ve açıklayıcı olun.
                    </p>
                  </div>
                  <div className="mb-6">
                    <InputField
                      label={renderLabel('Başlık *', <FiTag />)}
                      name="title"
                      placeholder="İlanınız için çekici bir başlık girin"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Örnek: "Profesyonel Web Tasarım ve Geliştirme Hizmeti"
                    </p>
                  </div>
                  <div className="mb-6">
                    <div className="space-y-2">
                      <label
                        htmlFor="description"
                        className="block text-sm font-medium text-gray-700"
                      >
                        {renderLabel('Açıklama *', <FiMessageSquare />)}
                      </label>
                      <div className="relative">
                        <Field
                          as="textarea"
                          id="description"
                          name="description"
                          rows={6}
                          placeholder="Hizmetinizi detaylı olarak açıklayın"
                          className="w-full py-2.5 px-3 bg-white border border-gray-300 rounded-lg focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 outline-none transition-all duration-300 text-gray-800 placeholder-gray-400 resize-none"
                        />
                      </div>
                      {errors.description && touched.description && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.description}
                        </p>
                      )}
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                      İyi bir açıklama şunları içerir: Sunduğunuz hizmetin
                      detayları, deneyiminiz, müşterilerinize sağladığınız
                      faydalar ve sizi farklı kılan özellikler.
                    </p>
                  </div>
                  <div className="flex justify-end mt-8">
                    <button
                      type="button"
                      onClick={() => {
                        step1Schema
                          .validate(
                            {
                              title: values.title,
                              description: values.description,
                            },
                            { abortEarly: false }
                          )
                          .then(() => nextStep())
                          .catch((err) => {
                            err.inner.forEach((e) =>
                              dispatch(
                                showToast({ message: e.message, type: 'error' })
                              )
                            );
                          });
                      }}
                      className="flex items-center justify-center bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition duration-300 ease-in-out font-medium"
                    >
                      Devam Et
                    </button>
                  </div>
                </div>
              )}
              {currentStep === 2 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100 mb-6">
                    <h3 className="text-lg font-medium text-indigo-800 flex items-center mb-2">
                      <FiGrid className="mr-2" /> Kategori ve Fiyat Bilgileri
                    </h3>
                    <p className="text-sm text-indigo-700">
                      Doğru kategori seçimi, ilanınızın ilgili müşterilere
                      ulaşmasını sağlar.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div>
                      <SelectField
                        label={renderLabel('Kategori *', <FiList />)}
                        name="category"
                        options={categories}
                        onChange={(e) => {
                          handleCategoryChange(e.target.value, setFieldValue);
                        }}
                      />
                    </div>
                    <div>
                      <SelectField
                        label={renderLabel('Alt Kategori *', <FiList />)}
                        name="subCategory"
                        options={
                          subCategories.length > 0
                            ? subCategories
                            : [
                                {
                                  name: 'Bu kategoriye ait alt kategori yok',
                                  value: '',
                                },
                              ]
                        }
                        onChange={(e) => {
                          setFieldValue('subCategory', e.target.value);
                          otherSubCategoryId(e.target.value);
                        }}
                        disabled={!selectedCategory}
                      />
                    </div>
                    {selectedSubCategory === 'Diğer' && (
                      <div className="md:col-span-2">
                        <InputField
                          label={renderLabel('Özel Alt Kategori *', <FiTag />)}
                          name="customSubCategory"
                          placeholder="Özel alt kategori adını girin"
                        />
                      </div>
                    )}
                    <div>
                      <SelectField
                        label={renderLabel('Hizmet Tipi *', <FiTag />)}
                        name="serviceType"
                        options={serviceTypeOptions}
                        placeholder="Hizmet tipini seçin"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Yüz yüze veya online olarak hizmet verip vermediğinizi
                        belirtin
                      </p>
                    </div>
                    <div>
                      <SelectField
                        label={renderLabel('Şehir *', <FiMapPin />)}
                        name="city"
                        options={cities}
                        placeholder="Şehir seçin"
                      />
                    </div>
                    <div>
                      <div className="relative">
                        <InputField
                          label={renderLabel('Fiyat *', <FiDollarSign />)}
                          name="price"
                          type="number"
                          placeholder="0"
                        />
                        <div className="absolute right-3 top-9 text-gray-500">
                          ₺
                        </div>
                      </div>
                    </div>
                    <div>
                      <SelectField
                        label={renderLabel('Fiyat Tipi *', <FiTag />)}
                        name="priceType"
                        options={priceTypeOptions}
                        placeholder="Fiyat tipini seçin"
                      />
                    </div>
                  </div>
                  <div className="flex justify-between mt-8">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="flex items-center justify-center bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition duration-300 ease-in-out font-medium"
                    >
                      <FiArrowLeft className="mr-2" /> Geri
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        step2Schema
                          .validate(
                            {
                              serviceType: values.serviceType,
                              city: values.city,
                              price: values.price,
                              priceType: values.priceType,
                              category: values.category,
                              subCategory: values.subCategory,
                            },
                            { abortEarly: false }
                          )
                          .then(() => nextStep())
                          .catch((err) => {
                            err.inner.forEach((e) =>
                              dispatch(
                                showToast({ message: e.message, type: 'error' })
                              )
                            );
                          });
                      }}
                      className="flex items-center justify-center bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition duration-300 ease-in-out font-medium"
                    >
                      Devam Et
                    </button>
                  </div>
                </div>
              )}
              {currentStep === 3 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100 mb-6">
                    <h3 className="text-lg font-medium text-indigo-800 flex items-center mb-2">
                      <FiImage className="mr-2" /> Görseller
                    </h3>
                    <p className="text-sm text-indigo-700">
                      Kaliteli görseller, ilanınızın dikkat çekmesini sağlar. En
                      az bir görsel yüklemelisiniz.
                    </p>
                  </div>

                  <UploadFile
                    selectedFiles={selectedFiles}
                    setSelectedFiles={setSelectedFiles}
                    previewUrls={previewUrls}
                    setPreviewUrls={setPreviewUrls}
                    isEditMode={false}
                  />

                  <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-between gap-4">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="flex items-center justify-center bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition duration-300 ease-in-out font-medium"
                    >
                      <FiArrowLeft className="mr-2" /> Geri
                    </button>
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => navigate('/dashboard/my-ads')}
                        className="flex items-center justify-center bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition duration-300 ease-in-out font-medium"
                      >
                        İptal
                      </button>
                      <button
                        type="submit"
                        onClick={customSubmit}
                        disabled={status === 'loading'}
                        className="flex items-center justify-center bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition duration-300 ease-in-out disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
                      >
                        <FiSave className="mr-2" /> İlanı Yayınla
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default MyAdsNew;
