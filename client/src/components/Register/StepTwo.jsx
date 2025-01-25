import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { stepTwoValidationSchema } from '../../validations/userValidation';
import { updateRegisterData } from '../../features/register/registerSlice';

const StepTwo = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
            <div className="mb-4">
              <label htmlFor="phone" className="block mb-2">
                Telefon
              </label>
              <Field
                id="phone"
                name="phone"
                type="text"
                className="border p-2 rounded w-full"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="city" className="block mb-2">
                Şehir
              </label>
              <Field
                id="city"
                name="city"
                type="text"
                className="border p-2 rounded w-full"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="profilePic" className="block mb-2">
                Profil Resmi URL
              </label>
              <Field
                id="profilePic"
                name="profilePic"
                type="text"
                className="border p-2 rounded w-full"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="portfolioLink" className="block mb-2">
                Portfolio Linki
              </label>
              <Field
                id="portfolioLink"
                name="portfolioLink"
                type="text"
                className="border p-2 rounded w-full"
              />
            </div>

            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Devam Et
            </button>
          </Form>
        );
      }}
    </Formik>
  );
};

export default StepTwo;
