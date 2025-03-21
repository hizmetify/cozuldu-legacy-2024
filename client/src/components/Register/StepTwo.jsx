import { memo, useEffect, useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from 'formik';
import { useNavigate, useOutletContext } from 'react-router-dom';
import {
  FaCity,
  FaEnvelopeOpenText,
  FaSpinner,
  FaInfoCircle,
} from 'react-icons/fa';

import { showToast } from '../../features/toast/toastSlice';
import { stepTwoValidationSchema } from '../../validations/userValidation';
import { updateRegisterData } from '../../features/register/registerSlice';
import { fetchCities } from '../../api/cityApi';
import SelectField from '../UI/SelectField';
import PhoneInputField from '../UI/PhoneInputField';
import InputField from '../UI/InputField';

let cachedCities = null;

const StepTwo = () => {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { setIsSubmitting } = useOutletContext() || {};

  useEffect(() => {
    const loadCities = async () => {
      try {
        setIsLoading(true);
        if (cachedCities) {
          setCities(cachedCities);
          setIsLoading(false);
          if (setIsSubmitting) {
            setIsSubmitting(false);
          }
          return;
        }

        const cityData = await fetchCities();
        setCities(cityData);
        cachedCities = cityData;
      } catch (error) {
        dispatch(
          showToast({
            message: 'Şehir listesi yüklenirken bir hata oluştu',
            type: 'error',
          })
        );
      } finally {
        setIsLoading(false);
        if (setIsSubmitting) {
          setIsSubmitting(false);
        }
      }
    };

    loadCities();

    return () => {
      if (setIsSubmitting) {
        setIsSubmitting(false);
      }
    };
  }, [dispatch, setIsSubmitting]);

  const { phone, city, email } = useSelector((state) => state.register.data);

  const initialValues = useMemo(
    () => ({
      phone: phone || '',
      city: city || '',
      email: email || '',
    }),
    [phone, city, email]
  );

  const handleFormSubmit = useCallback(
    (values, { setSubmitting }) => {
      dispatch(updateRegisterData(values));
      dispatch(
        showToast({ message: 'Adım 2 başarıyla tamamlandı!', type: 'success' })
      );
      setSubmitting(false);
      if (setIsSubmitting) {
        setIsSubmitting(false);
      }
      navigate('/register/step-3');
    },
    [dispatch, navigate, setIsSubmitting]
  );

  const customSubmit = useCallback(
    async (e, { validateForm, handleSubmit, setErrors }) => {
      if (e) e.preventDefault();
      const validationErrors = await validateForm();

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);

        const firstError = Object.values(validationErrors)[0];
        dispatch(showToast({ message: firstError, type: 'error' }));

        if (setIsSubmitting) {
          setIsSubmitting(false);
        }
      } else {
        await handleSubmit();
      }
    },
    [dispatch, setIsSubmitting]
  );
  const LoadingComponent = useMemo(
    () => (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center">
          <FaSpinner className="animate-spin text-blue-500 text-3xl mb-3" />
          <p className="text-gray-600">Şehir listesi yükleniyor...</p>
        </div>
      </div>
    ),
    []
  );

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={stepTwoValidationSchema}
      validateOnChange={true}
      validateOnBlur={true}
      onSubmit={handleFormSubmit}
      enableReinitialize={false}
    >
      {({ validateForm, handleSubmit, setErrors, errors, touched }) => (
        <Form
          id="stepForm-1"
          onSubmit={(e) =>
            customSubmit(e, { validateForm, handleSubmit, setErrors })
          }
          className="flex flex-col h-full"
        >
          {isLoading ? (
            LoadingComponent
          ) : (
            <div className="flex flex-col gap-6 flex-grow">
              <PhoneInputField
                name="phone"
                label="Telefon"
                error={errors.phone && touched.phone ? errors.phone : null}
              />
              <SelectField
                name="city"
                label="Şehir"
                options={cities}
                error={errors.city && touched.city ? errors.city : null}
                icon={FaCity}
              />
              <InputField
                name="email"
                label="E-posta"
                placeholder="E-posta adresinizi girin"
                error={errors.email && touched.email ? errors.email : null}
                icon={FaEnvelopeOpenText}
              />

              <div className="text-sm text-gray-500 mt-4 flex items-start">
                <FaInfoCircle className="text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                <p>Tüm alanlar zorunludur</p>
              </div>
            </div>
          )}
        </Form>
      )}
    </Formik>
  );
};

export default memo(StepTwo);
