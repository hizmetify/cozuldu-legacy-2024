import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from 'formik';
import { useNavigate } from 'react-router-dom';
import { loginValidation } from '../../validations/userValidation';
import { login } from '../../features/auth/authSlice';
import { showToast } from '../../features/toast/toastSlice';
import InputField from '../../components/UI/InputField';

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
      await dispatch(login(values)).unwrap();
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
    <div className="relative min-h-screen flex items-center justify-center bg-gray-50">
      <div className="absolute top-0 left-0 w-full overflow-hidden h-[200px] lg:h-[300px]">
        <svg
          className="absolute top-0 left-0 w-full h-full text-indigo-600 fill-current"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4f46e5" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
          <path
            fill="url(#waveGradient)"
            d="M0,224L40,202.7C80,181,160,139,240,154.7C320,171,400,245,480,256C560,267,640,213,720,181.3C800,149,880,139,960,154.7C1040,171,1120,213,1200,224C1280,235,1360,213,1400,202.7L1440,192L1440,0L1400,0C1360,0,1280,0,1200,0C1120,0,1040,0,960,0C880,0,800,0,720,0C640,0,560,0,480,0C400,0,320,0,240,0C160,0,80,0,40,0L0,0Z"
          ></path>
        </svg>
      </div>
      <div className="z-10 w-full max-w-md mx-auto px-4">
        <Formik
          initialValues={initialValues}
          validationSchema={loginValidation}
          validateOnChange={false}
          validateOnBlur={false}
          onSubmit={handleSubmit}
        >
          {({ validateForm, handleSubmit, setErrors, isSubmitting }) => {
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
              <Form
                onSubmit={customSubmit}
                className="mt-32 rounded-xl shadow-lg bg-white/60 
                           backdrop-blur-md p-6 flex flex-col gap-6"
              >
                <h2 className="text-2xl font-bold text-indigo-700 text-center mb-2">
                  Giriş Yap
                </h2>

                <InputField
                  label="E-posta"
                  name="email"
                  type="email"
                  placeholder="ornek@email.com"
                />

                <InputField
                  label="Şifre"
                  name="password"
                  type="password"
                  placeholder="Şifrenizi giriniz"
                />

                <button
                  type="submit"
                  disabled={isLoading || isSubmitting}
                  className="w-full mt-4 py-2 rounded
                             bg-indigo-500 hover:bg-indigo-600 
                             text-white font-medium 
                             transition-colors duration-200
                             disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isLoading || isSubmitting ? 'Yükleniyor...' : 'Giriş Yap'}
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
