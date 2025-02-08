import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from 'formik';
import { useNavigate } from 'react-router-dom';
import { loginValidation } from '../../validations/userValidation';
import { login } from '../../features/auth/authSlice';
import InputField from '../../components/UI/InputField';
import { showToast } from '../../features/toast/toastSlice';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state) => state.auth);

  const initialValues = {
    email: '',
    password: '',
  };

  const handleSubmit = async (values, { setErrors }) => {
    try {
      const response = await dispatch(login(values)).unwrap();

      dispatch(showToast({ message: 'Giriş başarılı!', type: 'success' }));
      navigate('/dashboard');
    } catch (error) {
      dispatch(showToast({ message: error, type: 'error' }));

      if (typeof error === 'object' && error.errors) {
        setErrors(error.errors);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-sm w-full bg-white rounded shadow-md p-6">
        <h2 className="text-xl font-bold text-center mb-4">Giriş Yap</h2>

        <Formik
          initialValues={initialValues}
          validationSchema={loginValidation}
          validateOnChange={false}
          validateOnBlur={false}
          onSubmit={handleSubmit}
        >
          {({ validateForm, handleSubmit, setErrors, isSubmitting }) => {
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
              <Form>
                <InputField
                  label="E-posta"
                  name="email"
                  type="email"
                  placeholder="ornek@email.com"
                />
                <div className="mt-4">
                  <InputField
                    label="Şifre"
                    name="password"
                    type="password"
                    placeholder="Şifrenizi giriniz"
                  />
                </div>

                <button
                  type="submit"
                  onClick={customSubmit}
                  disabled={isLoading || isSubmitting}
                  className={`mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded 
                    hover:bg-blue-700 transition-colors duration-200 
                    disabled:bg-gray-400 disabled:cursor-not-allowed
                  `}
                >
                  Giriş yap
                </button>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default LoginPage;
