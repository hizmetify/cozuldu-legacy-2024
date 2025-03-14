import { useState, useEffect, useRef } from 'react';
import { Formik, Form } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { createAd } from '../../features/ad/adSlice';
import { useNavigate } from 'react-router-dom';
import Spinner from '../../components/UI/Spinner';
import { AdSchema } from '../../validations/adValidation';
import { fetchCities } from '../../api/cityApi';
import { fetchAddSubcategoryByCategory, fetchCategories, fetchSubCategories } from '../../api/categoryApi';
import SelectField from '../../components/UI/SelectField';
import InputField from '../../components/UI/InputField';
import { showToast } from '../../features/toast/toastSlice';
import { FiUpload, FiX } from 'react-icons/fi';

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
  const [selectedSubCategory,setSelectedSubCategory]=useState("")
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
  const otherSubCategoryId=(value)=>{
    let other=subCategories.find(item => item.name == "Diğer"); 
    if(other._id==value){
      setSelectedSubCategory('Diğer')
    }else{
      setSelectedSubCategory('Other')
    }
    
  }
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
    customSubCategory:'',
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
      if(selectedSubCategory=='Diğer'){
      const addSubCategoryByCategoryClient=await fetchAddSubcategoryByCategory({subCategory:values['subCategory'],category:values['category'],name:values['customSubCategory']})
      console.log(addSubCategoryByCategoryClient.data);
      Object.assign(values,{subCategory:addSubCategoryByCategoryClient.data})
      
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
            <Form className="space-y-4">
              <InputField label="Başlık *" name="title" />
              <InputField
                label="Açıklama *"
                name="description"
                type="textarea"
              />

              <SelectField
                label="Kategori *"
                name="category"
                options={categories.map((category) => ({
                  name: category.name,
                  value: category._id,
                }))}
                onChange={(e) =>
                  handleCategoryChange(e.target.value, setFieldValue)
                }
              />
             
              <SelectField
                label="Alt Kategori *"
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
                
                onClick={(e)=>otherSubCategoryId(e.target.value)}
                // disabled={!selectedCategory}
              />
               {selectedSubCategory=='Diğer' ? (
               <InputField
                  label="CustomSub *"
                  name="customSubCategory"
                  type="textarea"
                />
               ):null} 
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
                  disabled={status === 'loading'}
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
