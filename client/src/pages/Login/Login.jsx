import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaEnvelope, FaLock } from 'react-icons/fa';
import { loginValidation } from '../../validations/userValidation';
import { login } from '../../features/auth/authSlice';
import { showToast } from '../../features/toast/toastSlice';
import InputField from '../../components/UI/InputField';
import { passwordSend } from '../../api/authApi';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [resetPass, setResetPass] = useState(false);
  const [email, setEmail] = useState('');
  const { isLoading } = useSelector((state) => state.auth);
  const [initialValues, setInitialValues] = useState(null);

  const [showPassword, setShowPassword] = useState(false);

  const modalRef = useRef(null);

  const resetPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await passwordSend({ email });
      if (response.status === false) return alert(response?.message);
      setResetPass(false);
    } catch (error) {
      console.error('Hata:', error);
    }
  };

  useEffect(() => {
    const storedRememberMe = localStorage.getItem('rememberMe') === 'true';
    setInitialValues({
      email: '',
      password: '',
      rememberMe: storedRememberMe,
    });
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        resetPass &&
        modalRef.current &&
        !modalRef.current.contains(event.target)
      ) {
        setResetPass(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [resetPass]);

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
    <>
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
                    <h2 className="text-2xl text-center py-1.5 border-b-2 border-gray-400 font-bold text-neutral-900">
                      Giriş Yap
                    </h2>
                  </div>

                  <div className="space-y-4">
                    <InputField
                      label="E-posta"
                      name="email"
                      type="email"
                      placeholder="E-posta adresinizi girin"
                      icon={FaEnvelope}
                    />

                    <div className="relative">
                      <InputField
                        label="Şifre"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Şifrenizi girin"
                        icon={FaLock}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? (
                          <FaEye size={18} />
                        ) : (
                          <FaEyeSlash size={18} />
                        )}
                      </button>
                    </div>
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

                    <p
                      onClick={() => setResetPass(true)}
                      className="cursor-pointer text-sm text-blue-600 hover:text-blue-500"
                    >
                      Şifremi unuttum
                    </p>
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

        {resetPass && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
            <div
              ref={modalRef}
              className="relative w-full max-w-md bg-white rounded-xl shadow-2xl mx-4 p-8 transform transition-all duration-300 ease-in-out"
            >
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-blue-600 rounded-full p-4 shadow-lg">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                  />
                </svg>
              </div>

              <button
                type="button"
                onClick={() => setResetPass(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors duration-200"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <h3 className="text-2xl font-bold text-center text-gray-800 mt-6 mb-2">
                Şifre Sıfırlama
              </h3>
              <p className="text-center text-gray-600 mb-6">
                Şifre sıfırlama bağlantısı için e-posta adresinizi girin
              </p>

              <form onSubmit={resetPassword} className="space-y-5">
                <div className="relative">
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-700"
                  >
                    E-posta Adresi
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <svg
                        className="w-5 h-5 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ornek@email.com"
                      className="w-full pl-10 p-3.5 border border-gray-300 rounded-lg focus:ring-2 
                              focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-3 pt-2">
                  <button
                    type="submit"
                    className="w-full px-4 py-3.5 rounded-lg bg-blue-600 text-white font-medium
                            hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500
                            transform transition-all duration-200 hover:shadow-lg"
                  >
                    Sıfırlama Bağlantısı Gönder
                  </button>
                  <button
                    type="button"
                    onClick={() => setResetPass(false)}
                    className="w-full px-4 py-3.5 rounded-lg border border-gray-300 text-gray-700
                            hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200
                            transition-all duration-200"
                  >
                    Vazgeç
                  </button>
                </div>
              </form>

              <div className="mt-6 text-center text-sm text-gray-500">
                Yardıma mı ihtiyacınız var?{' '}
                <a href="#" className="text-blue-600 hover:underline">
                  Destek ekibimizle iletişime geçin
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Login;
