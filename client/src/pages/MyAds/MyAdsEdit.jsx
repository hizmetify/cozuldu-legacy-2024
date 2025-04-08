import { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { updateAd, fetchSingleAd } from '../../features/ad/adSlice';
import { useNavigate, useParams } from 'react-router-dom';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import { fullAdSchema } from '../../validations/adValidation';
import { fetchCities } from '../../api/cityApi';
import {
  fetchAddSubcategoryByCategory,
  fetchCategories,
  fetchSubCategories,
} from '../../api/categoryApi';
import SelectField from '../../components/UI/SelectField';
import InputField from '../../components/UI/InputField';
import UploadFile from '../../components/MyAds/UploadFile';
import { showToast } from '../../features/toast/toastSlice';
import {
  FiSave,
  FiInfo,
  FiMapPin,
  FiTag,
  FiDollarSign,
  FiList,
  FiGrid,
  FiMessageSquare,
  FiImage,
  FiEdit,
  FiX,
} from 'react-icons/fi';
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

const MyAdsEdit = () => {
  const { adId } = useParams();
  const [cities, setCities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [previewUrls, setPreviewUrls] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [activeSection, setActiveSection] = useState('all');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedAd, singleAdStatus, status } = useSelector(
    (state) => state.ads
  );

  useEffect(() => {
    const fetchAdData = async () => {
      try {
        await dispatch(fetchSingleAd(adId)).unwrap();
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
        dispatch(
          showToast({
            message: 'İlan bilgileri yüklenirken bir hata oluştu',
            type: 'error',
          })
        );
      }
    };

    fetchAdData();
  }, [dispatch, adId]);

  useEffect(() => {
    if (selectedAd) {
      const ad = selectedAd;
      const categoryId = ad.category?._id || ad.category;
      if (categoryId) {
        handleCategoryChange(categoryId, () => {});
        setSelectedCategory(categoryId);
      }
      if (ad.images && ad.images.length > 0) {
        setExistingImages(ad.images);
      }
    }
  }, [selectedAd]);

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
    if (typeof categoryId === 'object') {
      categoryId = categoryId._id;
    }
    if (!categoryId || categoryId.length < 24) {
      setSubCategories([]);
      if (setFieldValue) setFieldValue('subCategory', '');
      return;
    }
    setSelectedCategory(categoryId);
    if (setFieldValue) {
      setFieldValue('category', categoryId);
      setFieldValue('subCategory', '');
    }

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

  if (singleAdStatus === 'loading' || !selectedAd) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  const ad = selectedAd;
  const initialValues = {
    title: ad.title || '',
    description: ad.description || '',
    serviceType: ad.serviceType || '',
    city: ad.city?._id || ad.city || '',
    price: ad.price || '',
    priceType: ad.priceType || '',
    category: ad.category?._id || ad.category || '',
    subCategory: ad.subCategory?._id || ad.subCategory || '',
    customSubCategory: '',
  };

  const handleSubmit = async (values, { setErrors }) => {
    try {
      if (
        existingImages.length - imagesToDelete.length + selectedFiles.length ===
        0
      ) {
        dispatch(
          showToast({
            message: 'En az bir görsel olmalıdır',
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
      if (imagesToDelete.length > 0) {
        formData.append('imagesToDelete', JSON.stringify(imagesToDelete));
      }
      await dispatch(updateAd({ adId, adData: formData })).unwrap();
      dispatch(
        showToast({
          message: 'İlan başarıyla güncellendi!',
          type: 'success',
        })
      );
      navigate('/dashboard/my-ads');
    } catch (error) {
      console.error('API Hatası:', error);
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

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <MetaHelmet
        title={`${ad.title} Düzenle`}
        description="İlanınızı düzenleyerek daha fazla müşteriye ulaşın. Başlık, açıklama, fiyat ve görselleri güncelleyin."
        keywords={`ilan düzenle, ${ad.category?.name || 'hizmet'}, ${
          ad.subCategory?.name || ''
        }, düzenleme`}
        canonical={`${window.location.origin}/dashboard/my-ads/${adId}/edit`}
      />
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-blue-600 opacity-90"></div>
        <div className="relative px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center">
                <div className="bg-white bg-opacity-20 p-3 rounded-full mr-4">
                  <FiEdit className="text-white text-xl" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white">
                    İlanı Düzenle
                  </h1>
                  <p className="text-indigo-100 mt-1">
                    İlanınızı güncelleyerek daha fazla müşteriye ulaşın
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveSection('all')}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors
                  ${
                    activeSection === 'all'
                      ? 'bg-white text-indigo-700'
                      : 'bg-indigo-600 bg-opacity-30 text-white hover:bg-opacity-40'
                  }`}
              >
                Tümü
              </button>
              <button
                onClick={() => setActiveSection('basic')}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center
                  ${
                    activeSection === 'basic'
                      ? 'bg-white text-indigo-700'
                      : 'bg-indigo-600 bg-opacity-30 text-white hover:bg-opacity-40'
                  }`}
              >
                <FiMessageSquare className="mr-1" /> Temel Bilgiler
              </button>
              <button
                onClick={() => setActiveSection('category')}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center
                  ${
                    activeSection === 'category'
                      ? 'bg-white text-indigo-700'
                      : 'bg-indigo-600 bg-opacity-30 text-white hover:bg-opacity-40'
                  }`}
              >
                <FiGrid className="mr-1" /> Kategori ve Fiyat
              </button>
              <button
                onClick={() => setActiveSection('images')}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center
                  ${
                    activeSection === 'images'
                      ? 'bg-white text-indigo-700'
                      : 'bg-indigo-600 bg-opacity-30 text-white hover:bg-opacity-40'
                  }`}
              >
                <FiImage className="mr-1" /> Görseller
              </button>
            </div>
          </div>
        </div>
      </div>

      {status === 'loading' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl flex flex-col items-center">
            <LoadingSpinner />
            <p className="mt-4 text-gray-700 font-medium">
              İlanınız güncelleniyor...
            </p>
          </div>
        </div>
      )}

      <Formik
        initialValues={initialValues}
        validationSchema={fullAdSchema}
        validateOnChange={false}
        validateOnBlur={false}
        enableReinitialize
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
              <div className="space-y-8">
                {(activeSection === 'all' || activeSection === 'basic') && (
                  <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center mb-4">
                      <div className="bg-indigo-100 p-2 rounded-full mr-3">
                        <FiMessageSquare className="text-indigo-600 text-xl" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        Temel Bilgiler
                      </h3>
                    </div>

                    <div className="space-y-6">
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
                              className="w-full py-2.5 px-3 bg-white border border-gray-300 rounded-lg
                                focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 outline-none
                                transition-all duration-300
                                text-gray-800 placeholder-gray-400 resize-none"
                            />
                          </div>
                          {errors.description && touched.description && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {(activeSection === 'all' || activeSection === 'category') && (
                  <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center mb-4">
                      <div className="bg-indigo-100 p-2 rounded-full mr-3">
                        <FiGrid className="text-indigo-600 text-xl" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        Kategori ve Fiyat Bilgileri
                      </h3>
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
                            label={renderLabel(
                              'Özel Alt Kategori *',
                              <FiTag />
                            )}
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
                  </div>
                )}
                {(activeSection === 'all' || activeSection === 'images') && (
                  <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center mb-4">
                      <div className="bg-indigo-100 p-2 rounded-full mr-3">
                        <FiImage className="text-indigo-600 text-xl" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        Görseller
                      </h3>
                    </div>

                    <UploadFile
                      selectedFiles={selectedFiles}
                      setSelectedFiles={setSelectedFiles}
                      previewUrls={previewUrls}
                      setPreviewUrls={setPreviewUrls}
                      existingImages={existingImages}
                      imagesToDelete={imagesToDelete}
                      setImagesToDelete={setImagesToDelete}
                      isEditMode={true}
                    />
                  </div>
                )}
              </div>
              <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-between gap-4">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard/my-ads')}
                  className="flex items-center justify-center bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition duration-300 ease-in-out font-medium"
                >
                  <FiX className="mr-2" /> İptal
                </button>
                <button
                  type="submit"
                  onClick={customSubmit}
                  disabled={status === 'loading'}
                  className="flex items-center justify-center bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition duration-300 ease-in-out disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
                >
                  <FiSave className="mr-2" /> Değişiklikleri Kaydet
                </button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default MyAdsEdit;
