import { memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from 'formik';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { stepTwoValidationSchema } from '../../validations/userValidation';
import { updateRegisterData } from '../../features/register/registerSlice';
import { useEffect, useState } from 'react';
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

  return (
    <Formik
      initialValues={{
        phone,
        city,
        profilePic,
        portfolioLink,
      }}
      validationSchema={stepTwoValidationSchema}
      validateOnChange={false}
      validateOnBlur={false}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          await stepTwoValidationSchema.validate(values, { abortEarly: false });
          dispatch(updateRegisterData(values));
          toast.success('Adım 2 başarıyla tamamlandı!');
          navigate('/register/step-3');
        } catch (error) {
          if (error.inner) {
            error.inner.forEach((err) => {
              toast.error(err.message);
            });
          }
        }
        setSubmitting(false);
      }}
    >
      {({ errors, validateForm, handleSubmit }) => {
        const handleNextStep = async (e) => {
          e.preventDefault();
          const validationErrors = await validateForm();

          console.log('Validation Errors:', validationErrors);

          if (Object.keys(validationErrors).length > 0) {
            Object.entries(validationErrors).forEach(([field, err]) => {
              toast.error(err);
              console.log(`Error in ${field}: ${err}`);
            });
          } else {
            handleSubmit()
          }
        };
        return (
          <Form>
            <div className="flex flex-col justify-between gap-3">
              <InputField
                name="phone"
                label="Telefon"
                placeholder={'Telefon Numarası'}
              />
              <SelectField name="city" label="Şehir" options={cities} />
              <InputField
                name="profilePic"
                label="Profil Resmi URL"
                placeholder={'Profil fotoğrafı linki'}
              />
              <InputField
                name="portfolioLink"
                label="Portfolio Linki"
                placeholder={'Portfolio linkinizi girin'}
              />

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded-sm font-medium hover:bg-gray-300 transition"
                  onClick={() => navigate('/register/step-1')}
                >
                  Geri
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-sm font-medium hover:bg-blue-700 transition"
                  onClick={handleNextStep}
                >
                  Devam et
                </button>
              </div>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default memo(StepTwo);
