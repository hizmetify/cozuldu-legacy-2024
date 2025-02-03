import { memo, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from 'formik';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { stepTwoValidationSchema } from '../../validations/userValidation';
import { updateRegisterData } from '../../features/register/registerSlice';
import { fetchCities } from '../../api/cityApi';
import InputField from '../UI/InputField';
import SelectField from '../UI/SelectField';
import ButtonGroup from '../UI/ButtonGroup';

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
      onSubmit={async (values, { setSubmitting, setErrors }) => {
        try {
          await stepTwoValidationSchema.validate(values, { abortEarly: false });
          dispatch(updateRegisterData(values));
          toast.success('Adım 2 başarıyla tamamlandı!');
          navigate('/register/step-3');
        } catch (error) {
          if (error.inner) {
            let formErrors = {};
            error.inner.forEach((err) => {
              formErrors[err.path] = err.message;
              toast.error(err.message);
            });
            setErrors(formErrors);
          }
        }
        setSubmitting(false);
      }}
    >
      {({ validateForm, handleSubmit, isSubmitting, setErrors }) => {
        const handleNextStep = async (e) => {
          e.preventDefault();
          const validationErrors = await validateForm();


          if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            Object.entries(validationErrors).forEach(([field, err]) => {
              toast.error(err);
            });
          } else {
            await handleSubmit(); 
          }
        };

        return (
          <Form className="flex flex-col h-full">
            <div className="flex flex-col gap-3 flex-grow">
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
            </div>

            <div className="mt-auto">
              <ButtonGroup
                currentStep={2}
                totalSteps={3}
                onPrevious={() => navigate('/register/step-1')}
                onNext={handleNextStep} // ✅ onNext bağlıyoruz.
                isSubmitting={isSubmitting}
              />
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default memo(StepTwo);
