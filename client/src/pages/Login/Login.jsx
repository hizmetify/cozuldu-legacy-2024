import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import { useNavigate } from 'react-router-dom';
import { loginValidation } from '../../validations/userValidation';
import { login } from '../../features/auth/authSlice';
import { showToast } from '../../features/toast/toastSlice';
import InputField from '../../components/UI/InputField';
import { passwordSend } from '../../api/authApi';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); 
  
  const [resetPass,setResetPass]=useState(false)
  const [email, setEmail] = useState('');
  const { isLoading } = useSelector((state) => state.auth);
  const [initialValues, setInitialValues] = useState(null);
  const resetPassword = async (e) => {
    e.preventDefault();
    try { 
      let response=await passwordSend({email})
      if(response.status==false)
        return alert(response?.message) 
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

                  <p
                    onClick={()=>setResetPass(true)}
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
        <div className='absolute flex justify-center items-center w-full h-full bg-black bg-opacity-50'>
          <div className='bg-white p-8 rounded-md shadow-lg w-1/2'>
            <h3 className='text-center text-xl font-semibold mb-4'>
              Lütfen E-Mail Bilgisini Giriniz
            </h3>
            <form onSubmit={resetPassword}>
              <input
                label="E-posta"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)} // E-posta değişimini kontrol et
                placeholder="E-posta adresinizi girin"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4"
              />
              <div className='flex justify-between'>
                <button
                  type="submit"
                  className="w-1/2 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-500"
                >
                  Gönder
                </button>
                <p
                  className='text-red-500 cursor-pointer self-center'
                  onClick={() => setResetPass(false)}  // Kapatmak için
                >
                  Kapat
                </p>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
