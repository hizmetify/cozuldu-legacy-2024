import { Formik, Form } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import FormLayout from '../layouts/FormLayout';
import InputField from '../components/UI/inputField';
import { loginValidation } from '../validations/userValidations';
import { useNavigate } from 'react-router-dom';
import { login } from '../features/authSlice';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth);

  const initialValues = {
    email: '',
    password: '',
  };

  const handleSubmit = async (values) => {
    try {
      await dispatch(login(values)).unwrap();
      toast.success('Başarıyla giriş yaptınız!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err);
    }
  };

  return (
    <FormLayout>
      <h1 className="text-3xl font-bold text-center mb-8">Giriş Yap</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={loginValidation}
        onSubmit={handleSubmit}
      >
        {({ errors }) => (
          <Form>
            <InputField
              label="E-posta"
              name="email"
              type="email"
              placeholder="E-posta adresinizi girin"
            />
            <InputField
              label="Şifre"
              name="password"
              type="password"
              placeholder="Şifrenizi girin"
            />
            {Object.keys(errors).length > 0 && (
              <p className="text-red-500 text-sm mt-2">
                Hatalı ya da eksik bilgi girdiniz.
              </p>
            )}
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded mt-4"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
            </button>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </Form>
        )}
      </Formik>
    </FormLayout>
  );
};

export default Login;
