import { memo, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from 'formik';
import { useNavigate } from 'react-router-dom';

import { showToast } from '../../features/toast/toastSlice';
import { stepTwoValidationSchema } from '../../validations/userValidation';
import { updateRegisterData } from '../../features/register/registerSlice';
import { fetchCities } from '../../api/cityApi';
import SelectField from '../UI/SelectField';
import PhoneInputField from '../UI/PhoneInputField';
import InputField from '../UI/InputField';

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

  const { phone, city, email } = useSelector((state) => state.register.data);

  const initialValues = { phone, city };

  const handleSubmit = async (
    values,
    { setSubmitting, setErrors, validateForm }
  ) => {
    const errors = await validateForm();
    if (Object.keys(errors).length) {
      Object.keys(errors).forEach((key) => {
        dispatch(showToast({ message: errors[key], type: 'error' }));
      });
      setErrors(errors);
      setSubmitting(false);
      return;
    }

    try {
      dispatch(updateRegisterData(values));
      dispatch(
        showToast({ message: 'Adım 2 başarıyla tamamlandı!', type: 'success' })
      );
      navigate('/register/step-3');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={stepTwoValidationSchema}
      validateOnMount={true}
      validateOnChange={false}
      validateOnBlur={false}
      onSubmit={handleSubmit}
    >
      {() => (
        <Form id="stepForm-1" className="flex flex-col h-full">
          <div className="flex flex-col gap-3 flex-grow">
            <PhoneInputField name="phone" label="Telefon" />
            <SelectField name="city" label="Şehir" options={cities} />
            <InputField
              name="email"
              label="E-posta"
              placeholder="E-posta adresinizi girin"
            />
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default memo(StepTwo);
