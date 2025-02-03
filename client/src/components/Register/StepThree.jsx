import { memo } from 'react';
import { Formik, Form } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { stepThreeValidationSchema } from '../../validations/userValidation';
import { toast } from 'react-hot-toast';
import { updateRegisterData } from '../../features/register/registerSlice';
import { register } from '../../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import InputField from '../UI/InputField';

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

              <InputField name="password" label="Şifre" type={'password'} />
              <InputField
                name="confirmPassword"
                label="Şifre (Tekrar)"
                type={'password'}
              />
              <div className="flex items-center justify-between">
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
              </div>

          </Form>
        );
      }}
    </Formik>
  );
};

export default memo(StepThree);
