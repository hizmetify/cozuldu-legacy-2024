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
      onSubmit={(values) => {
        dispatch(updateRegisterData(values));
        toast.success('Adım 2 başarıyla tamamlandı!');
        navigate('/register/step-3');
      }}
    >
      {({ errors, validateForm, handleSubmit }) => {
        const customSubmit = async (e) => {
          e.preventDefault();
          const validationErrors = await validateForm();
          if (Object.keys(validationErrors).length > 0) {
            Object.values(validationErrors).forEach((err) => toast.error(err));
          } else {
            handleSubmit();
          }
        };

        return (
          <Form onSubmit={customSubmit}>
            <div className="flex flex-col justify-between gap-4">
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
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Devam Et
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                  onClick={() => navigate('/register/step-1')}
                >
                  Geri
                </button>
              </div>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default StepTwo;
