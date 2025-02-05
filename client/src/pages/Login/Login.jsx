
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { login } from '../../features/auth/authSlice';
import InputField from '../../components/UI/InputField';
const LoginPage = () => {
  const dispatch = useDispatch();
  const { isLoading, isError, errorMessage } = useSelector((state) => state.auth);

  const initialValues = {
    email: '',
    password: '',
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Geçerli bir e-posta adresi giriniz.')
      .required('E-posta alanı zorunludur.'),
    password: Yup.string()
      .required('Şifre alanı zorunludur.'),
  });

  const handleSubmit = async (values) => {
    dispatch(login(values));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-sm w-full bg-white rounded shadow-md p-6">
        <h2 className="text-xl font-bold text-center mb-4">Giriş Yap</h2>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
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
              {isError && (
                <div className="mt-2 text-red-600 text-sm">
                  {errorMessage}
                </div>
              )}
              <button
                type="submit"
                disabled={isLoading || isSubmitting}
                className={`
                  mt-6 w-full 
                  bg-blue-600 text-white 
                  py-2 px-4 rounded 
                  hover:bg-blue-700 
                  transition-colors 
                  duration-200 
                  disabled:bg-gray-400 
                  disabled:cursor-not-allowed
                `}
              >
                {isLoading || isSubmitting ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default LoginPage;
