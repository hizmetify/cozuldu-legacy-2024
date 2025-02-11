import { memo, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from 'formik';
import { useNavigate } from 'react-router-dom';

import { showToast } from '../../features/toast/toastSlice';
import { stepTwoValidationSchema } from '../../validations/userValidation';
import { updateRegisterData } from '../../features/register/registerSlice';
import { fetchCities } from '../../api/cityApi';

import InputField from '../UI/InputField';
import SelectField from '../UI/SelectField';

const StepTwo = () => {
  const [cities, setCities] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    const loadCities = async () => {
      const cityData = await fetchCities();
      setCities(cityData);
    };
    loadCities();
  }, []);
  const { phone, city, profilePic, portfolioLink } = useSelector(
    (state) => state.register.data
  );
  const initialValues = { phone, city, profilePic, portfolioLink };

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      await stepTwoValidationSchema.validate(values, { abortEarly: false });
      dispatch(updateRegisterData(values));
      dispatch(showToast({ message: 'Adım 2 başarıyla tamamlandı!', type: 'success' }));
      navigate('/register/step-3');
    } catch (error) {
      if (error.inner) {
        const formErrors = {};
        error.inner.forEach((err) => {
          formErrors[err.path] = err.message;
          dispatch(showToast({ message: err.message, type: 'error' }));
        });
        setErrors(formErrors);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={stepTwoValidationSchema}
      validateOnChange={false}
      validateOnBlur={false}
      onSubmit={handleSubmit}
    >
      {() => (
        <Form id="stepForm-1" className="flex flex-col h-full">
          <div className="flex flex-col gap-3 flex-grow">
            <InputField
              name="phone"
              label="Telefon"
              placeholder="Telefon Numarası"
            />
            <SelectField
              name="city"
              label="Şehir"
              options={cities}
            />
            <InputField
              name="profilePic"
              label="Profil Resmi URL"
              placeholder="Profil fotoğrafı linki"
            />
            <InputField
              name="portfolioLink"
              label="Portfolio Linki"
              placeholder="Portfolio linkinizi girin"
            />
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default memo(StepTwo);
  