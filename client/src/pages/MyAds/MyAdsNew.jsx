import { useState, useEffect, useRef } from 'react';
import { Formik, Form } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { createAd } from '../../features/ad/adSlice';
import { useNavigate } from 'react-router-dom';
import Spinner from '../../components/UI/Spinner';
import { AdSchema } from '../../validations/adValidation';
import { fetchCities } from '../../api/cityApi';
import SelectField from '../../components/UI/SelectField';
import InputField from '../../components/UI/InputField';
import { showToast } from '../../features/toast/toastSlice';
import { FiUpload, FiX } from 'react-icons/fi';

const MAX_FILES = 5;

const serviceTypeOptions = ['yüz yüze'];
const priceTypeOptions = ['saatlik', 'günlük', 'iş başı'];

const MyAdsNew = () => {
  const [cities, setCities] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRef = useRef(null);

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
    const files = Array.from(e.target.files);
    if (selectedFiles.length + files.length > MAX_FILES) {
      dispatch(
        showToast({
          message: `En fazla ${MAX_FILES} görsel yükleyebilirsiniz.`,
          type: 'error',
        })
      );
      return;
    }
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.dataTransfer.files);
    if (selectedFiles.length + files.length > MAX_FILES) {
      dispatch(
        showToast({
          message: `En fazla ${MAX_FILES} görsel yükleyebilirsiniz.`,
          type: 'error',
        })
      );
      return;
    }
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const removeFile = (index) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
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
      selectedFiles.slice(0, MAX_FILES).forEach((file) => {
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
      {status === 'loading' && <Spinner className="mb-4" />}
      <Formik
        initialValues={initialValues}
        validationSchema={AdSchema}
        validateOnChange={false}
        validateOnBlur={false}
        onSubmit={handleSubmit}
      >
        {({ validateForm, handleSubmit, setErrors, errors, touched }) => {
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
              <InputField label="Başlık *" name="title" />
              <InputField
                label="Açıklama *"
                name="description"
                type="textarea"
              />
              <SelectField
                label="Hizmet Tipi *"
                name="serviceType"
                options={serviceTypeOptions.map((opt) => ({ name: opt }))}
              />
              <SelectField label="Şehir *" name="city" options={cities} />
              <InputField label="Fiyat *" name="price" type="number" />
              <SelectField
                label="Fiyat Tipi *"
                name="priceType"
                options={priceTypeOptions.map((opt) => ({ name: opt }))}
              />
              <div>
                <label className="block font-medium mb-2">Resimler</label>
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition duration-300 ease-in-out"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current.click()}
                >
                  <FiUpload className="mx-auto text-4xl text-gray-400 mb-2" />
                  <p className="text-gray-600">
                    Dosyaları buraya sürükleyin veya seçmek için tıklayın
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
                  <div className="mt-4">
                    <p className="font-medium mb-2">
                      Seçilen Dosyalar ({selectedFiles.length} / {MAX_FILES}):
                    </p>
                    <ul className="space-y-2">
                      {selectedFiles.map((file, index) => (
                        <li
                          key={index}
                          className="flex items-center justify-between bg-gray-100 p-2 rounded"
                        >
                          <span className="truncate">{file.name}</span>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FiX />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div className="pt-4">
                <button
                  type="submit"
                  onClick={customSubmit}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition duration-300 ease-in-out disabled:bg-gray-400 disabled:cursor-not-allowed"
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
