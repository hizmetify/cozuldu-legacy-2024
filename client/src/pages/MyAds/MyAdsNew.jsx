import { useState, useEffect, useRef } from 'react';
import { Formik, Form, Field } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { createAd } from '../../features/ad/adSlice';
import { useNavigate } from 'react-router-dom';
import Spinner from '../../components/UI/Spinner';
import { AdSchema } from '../../validations/adValidation';
import { fetchCities } from '../../api/cityApi';
import {
  fetchAddSubcategoryByCategory,
  fetchCategories,
  fetchSubCategories,
} from '../../api/categoryApi';
import SelectField from '../../components/UI/SelectField';
import InputField from '../../components/UI/InputField';
import { showToast } from '../../features/toast/toastSlice';
import { FiUpload, FiX, FiImage, FiArrowLeft, FiSave } from 'react-icons/fi';

const MAX_FILES = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const serviceTypeOptions = ['yüz yüze'];
const priceTypeOptions = ['saatlik', 'günlük', 'iş başı'];

const MyAdsNew = () => {
  const [cities, setCities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [previewUrls, setPreviewUrls] = useState([]);
  const fileInputRef = useRef(null);

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
        setCities(cityData);
        setCategories(categoryData);
      } catch (error) {
        dispatch(
          showToast({
            message: 'Veriler yüklenirken bir hata oluştu',
            type: 'error',
          })
        );
      }
    };
    loadInitialData();
  }, [dispatch]);

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
      return;
    }

    setSelectedCategory(categoryId);
    setFieldValue('category', categoryId);
    setFieldValue('subCategory', '');

    try {
      const subCategoryData = await fetchSubCategories(categoryId);
      setSubCategories(subCategoryData);
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

  const otherSubCategoryId = (value) => {
    const other = subCategories.find((item) => item.name == 'Diğer');
    if (other && other._id == value) {
      setSelectedSubCategory('Diğer');
    } else {
      setSelectedSubCategory('Other');
    }
  };

  const validateFile = (file) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new Error('Sadece JPG, PNG ve WEBP formatları desteklenir');
    }
    if (file.size > MAX_FILE_SIZE) {
      throw new Error("Dosya boyutu 5MB'dan küçük olmalıdır");
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    if (selectedFiles.length + files.length > MAX_FILES) {
      dispatch(
        showToast({
          message: `En fazla ${MAX_FILES} görsel yükleyebilirsiniz`,
          type: 'error',
        })
      );
      return;
    }
    const validFiles = files.filter((file) => {
      try {
        validateFile(file);
        return true;
      } catch (error) {
        dispatch(showToast({ message: error.message, type: 'error' }));
        return false;
      }
    });

    setSelectedFiles((prev) => [...prev, ...validFiles]);
    e.target.value = '';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length) {
      const imageFiles = files.filter((file) => file.type.startsWith('image/'));
      if (imageFiles.length) {
        handleFileChange({ target: { files: imageFiles } });
      }
    }
  };

  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const initialValues = {
    title: '',
    description: '',
    serviceType: 'yüz yüze',
    category: '',
    subCategory: '',
    customSubCategory: '',
    city: '',
    price: '',
    priceType: 'saatlik',
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

      const formData = new FormData();
      console.log(values);
      if (selectedSubCategory == 'Diğer') {
        const addSubCategoryByCategoryClient =
          await fetchAddSubcategoryByCategory({
            subCategory: values['subCategory'],
            category: values['category'],
            name: values['customSubCategory'],
          });
        console.log(addSubCategoryByCategoryClient.data);
        Object.assign(values, {
          subCategory: addSubCategoryByCategoryClient.data,
        });
      }
      delete values.customSubCategory;
      console.log(values);

      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value);
      });

      selectedFiles.forEach((file, index) => {
        formData.append('images', file);
      });
      const response = await dispatch(createAd(formData)).unwrap();
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
        status: error.response?.status,
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

  const renderLabel = (text) => {
    if (text.includes('*')) {
      const parts = text.split('*');
      return (
        <>
          {parts[0]}
          <span className="text-red-600 font-bold">*</span>
        </>
      );
    }
    return text;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-600 to-blue-500 p-6">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <FiImage className="mr-2" /> Yeni İlan Ekle
        </h2>
        <p className="text-indigo-100 mt-1">
          Hizmetinizi tanıtmak için aşağıdaki formu doldurun
        </p>
      </div>

      {status === 'loading' && (
        <div className="flex justify-center p-6">
          <Spinner className="w-10 h-10 text-indigo-600" />
        </div>
      )}

      <Formik
        initialValues={initialValues}
        validationSchema={AdSchema}
        validateOnChange={false}
        validateOnBlur={false}
        onSubmit={handleSubmit}
      >
        {({ validateForm, handleSubmit, setErrors, setFieldValue }) => {
          const customSubmit = async (e) => {
            e?.preventDefault();
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <div className="md:col-span-2">
                  <InputField
                    label={renderLabel('Başlık *')}
                    name="title"
                    placeholder="İlanınız için çekici bir başlık girin"
                  />
                </div>

                <div className="md:col-span-2">
                  <div className="space-y-2">
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700"
                    >
                      {renderLabel('Açıklama *')}
                    </label>
                    <div className="relative">
                      <Field
                        as="textarea"
                        id="description"
                        name="description"
                        rows={4}
                        placeholder="Hizmetinizi detaylı olarak açıklayın"
                        className="w-full py-2.5 px-2 bg-transparent border-0 border-b-2 border-gray-200 
                          focus:border-indigo-600 outline-none focus:outline-none
                          transition-all duration-300
                          text-gray-800 placeholder-gray-400 resize-none"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <SelectField
                    label={renderLabel('Kategori *')}
                    name="category"
                    options={categories.map((category) => ({
                      name: category.name,
                      value: category._id,
                    }))}
                    onChange={(e) =>
                      handleCategoryChange(e.target.value, setFieldValue)
                    }
                  />
                </div>

                <div>
                  <SelectField
                    label={renderLabel('Alt Kategori *')}
                    name="subCategory"
                    options={
                      subCategories.length > 0
                        ? subCategories.map((subCategory) => ({
                            name: subCategory.name,
                            value: subCategory._id,
                          }))
                        : [
                            {
                              name: 'Bu kategoriye ait alt kategori yok',
                              value: '',
                            },
                          ]
                    }
                    onClick={(e) => otherSubCategoryId(e.target.value)}
                    disabled={!selectedCategory}
                  />
                </div>

                {selectedSubCategory == 'Diğer' && (
                  <div className="md:col-span-2">
                    <InputField
                      label={renderLabel('Özel Alt Kategori *')}
                      name="customSubCategory"
                      placeholder="Özel alt kategori adını girin"
                    />
                  </div>
                )}

                <div>
                  <SelectField
                    label={renderLabel('Hizmet Tipi *')}
                    name="serviceType"
                    options={serviceTypeOptions.map((opt) => ({ name: opt }))}
                  />
                </div>

                <div>
                  <SelectField
                    label={renderLabel('Şehir *')}
                    name="city"
                    options={cities}
                  />
                </div>

                <div>
                  <InputField
                    label={renderLabel('Fiyat *')}
                    name="price"
                    type="number"
                    placeholder="0"
                  />
                </div>

                <div>
                  <SelectField
                    label={renderLabel('Fiyat Tipi *')}
                    name="priceType"
                    options={priceTypeOptions.map((opt) => ({ name: opt }))}
                  />
                </div>

                <div className="md:col-span-2 mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Resimler<span className="text-red-600 font-bold">*</span>
                  </label>
                  <div
                    className="border-2 border-dashed border-indigo-300 rounded-lg p-8 text-center cursor-pointer hover:border-indigo-500 transition duration-300 ease-in-out bg-indigo-50"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current.click()}
                  >
                    <FiUpload className="mx-auto text-5xl text-indigo-500 mb-3" />
                    <p className="text-indigo-700 font-medium mb-1">
                      Dosyaları buraya sürükleyin
                    </p>
                    <p className="text-indigo-600 text-sm">veya</p>
                    <button
                      type="button"
                      className="mt-3 bg-white text-indigo-600 border border-indigo-300 rounded-full px-6 py-2 hover:bg-indigo-100 transition duration-200"
                    >
                      Dosya Seç
                    </button>
                    <p className="mt-3 text-xs text-gray-500">
                      Maksimum {MAX_FILES} görsel, her biri 5MB'dan küçük (JPG,
                      PNG, WEBP)
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>

                  {selectedFiles.length > 0 && (
                    <div className="mt-6">
                      <p className="font-medium mb-3 text-gray-700 flex items-center">
                        <FiImage className="mr-2" />
                        Seçilen Görseller ({selectedFiles.length} / {MAX_FILES})
                      </p>

                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                        {previewUrls.map((url, index) => (
                          <div key={index} className="relative group">
                            <div className="aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                              <img
                                src={url || '/placeholder.svg'}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFile(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition duration-200"
                            >
                              <FiX className="w-4 h-4" />
                            </button>
                            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-xs p-1 truncate">
                              {selectedFiles[index].name}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-between gap-4">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard/my-ads')}
                  className="flex items-center justify-center bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition duration-300 ease-in-out font-medium"
                >
                  <FiArrowLeft className="mr-2" /> İptal
                </button>
                <button
                  type="submit"
                  onClick={customSubmit}
                  disabled={status === 'loading'}
                  className="flex items-center justify-center bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition duration-300 ease-in-out disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
                >
                  {status === 'loading' ? (
                    <>
                      <Spinner className="w-5 h-5 mr-2" /> Kaydediliyor...
                    </>
                  ) : (
                    <>
                      <FiSave className="mr-2" /> Kaydet
                    </>
                  )}
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
