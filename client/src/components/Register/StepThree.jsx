import { Formik, Form, Field } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { stepThreeValidationSchema } from '../../validations/userValidation';
import { toast } from 'react-hot-toast';
import { updateRegisterData } from '../../features/register/registerSlice';
import { register } from '../../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

const StepThree = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const registerData = useSelector((state) => state.register.data);
  const { password, confirmPassword } = registerData;

  return (
    <Formik
      initialValues={{
        password,
        confirmPassword,
      }}
      validationSchema={stepThreeValidationSchema}
      validateOnChange={false}
      validateOnBlur={false}
      onSubmit={async (values) => {
        dispatch(updateRegisterData(values));

        try {
          const finalData = {
            ...registerData,
            ...values,
          };

          await dispatch(register(finalData)).unwrap();

          toast.success('Kayıt başarılı!');
          navigate('/dashboard');
        } catch (error) {
          toast.error(error);
        }
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
              <label htmlFor="password" className="block mb-2">
                Şifre
              </label>
              <Field
                id="password"
                name="password"
                type="password"
                className="border p-2 rounded w-full"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block mb-2">
                Şifre (Tekrar)
              </label>
              <Field
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                className="border p-2 rounded w-full"
              />
            </div>

            <button
              type="button"
              onClick={() => navigate('/register/step-2')}
              className="bg-gray-300 text-black px-4 py-2 rounded mr-2"
            >
              Geri
            </button>

            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Kayıt Ol
            </button>
          </Form>
        );
      }}
    </Formik>
  );
};

export default StepThree;
