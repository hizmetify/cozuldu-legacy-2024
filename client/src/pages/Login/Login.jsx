import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import { useNavigate } from 'react-router-dom';
import { loginValidation } from '../../validations/userValidation';
import { login } from '../../features/auth/authSlice';
import { showToast } from '../../features/toast/toastSlice';
import InputField from '../../components/UI/InputField';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state) => state.auth);
  const [initialValues, setInitialValues] = useState(null);
  useEffect(() => {
    const storedRememberMe = localStorage.getItem('rememberMe') === 'true';
    setInitialValues({
      email: '',
      password: '',
      rememberMe: storedRememberMe,
    });
  }, []);

  const handleSubmit = async (values, { setErrors }) => {
    try {
      await dispatch(login(values)).unwrap();

      if (values.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('rememberMe');
      }

      dispatch(showToast({ message: 'Giriş başarılı!', type: 'success' }));
      navigate('/dashboard');
    } catch (error) {
      dispatch(showToast({ message: error, type: 'error' }));
      if (typeof error === 'object' && error.errors) {
        setErrors(error.errors);
      }
    }
  };

  if (initialValues === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Yükleniyor...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-md">
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
              <Form onSubmit={customSubmit} className="space-y-6">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-blue-600">
                    Giriş Yap
                  </h2>
                  <p className="mt-2 text-sm text-gray-600">
                    Hesabınıza erişmek için giriş yapın
                  </p>
                </div>

                <div className="space-y-4">
                  <InputField
                    label="E-posta"
                    name="email"
                    type="email"
                    placeholder="E-posta adresinizi girin"
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />

                  <InputField
                    label="Şifre"
                    name="password"
                    type="password"
                    placeholder="Şifrenizi girin"
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <Field
                      type="checkbox"
                      name="rememberMe"
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      Beni hatırla
                    </span>
                  </label>

                  <a
                    href="/forgot-password"
                    className="text-sm text-blue-600 hover:text-blue-500"
                  >
                    Şifremi unuttum
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || isSubmitting}
                  className="w-full py-3 px-4 rounded-lg bg-blue-600 text-white font-medium 
                           hover:bg-blue-700 focus:outline-none focus:ring-2 
                           focus:ring-offset-2 focus:ring-blue-500 
                           disabled:bg-gray-400 disabled:cursor-not-allowed 
                           transition-colors duration-200"
                >
                  {isLoading || isSubmitting ? 'Yükleniyor...' : 'Devam Et'}
                </button>

                <p className="text-center text-sm text-gray-600">
                  Hesabınız yok mu?{' '}
                  <a
                    href="/register"
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Kayıt ol
                  </a>
                </p>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default Login;
