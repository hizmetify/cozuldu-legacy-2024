import { memo } from 'react';
import { Formik, Form } from 'formik';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { stepOneValidationSchema } from '../../validations/userValidation';
import { useDispatch, useSelector } from 'react-redux';
import { updateRegisterData } from '../../features/register/registerSlice';
import InputField from '../UI/InputField';

const StepOne = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { name, lastname, email } = useSelector((state) => state.register.data);

  return (
    <Formik
      initialValues={{ name, lastname, email }}
      validationSchema={stepOneValidationSchema}
      validateOnChange={false}
      validateOnBlur={false}
      onSubmit={(values) => {
        dispatch(updateRegisterData(values));
        toast.success('Adım 1 başarıyla tamamlandı!');
        navigate('/register/step-2');
      }}
    >
      {({ errors, validateForm, handleSubmit }) => {
        const customSubmit = async (e) => {
          e.preventDefault();
          const validationErrors = await validateForm();

          if (Object.keys(validationErrors).length > 0) {
            Object.values(validationErrors).forEach((errorMsg) =>
              toast.error(errorMsg)
            );
          } else {
            handleSubmit();
          }
        };

        return (
          <Form onSubmit={customSubmit}>
            <div className="flex flex-col gap-3 justify-between h-full">
              <InputField
                name="name"
                label="İsim"
                placeholder={'Adınızı girin'}
              />
              <InputField
                name="lastname"
                label="Soyisim"
                placeholder={'Soyadınızı girin'}
              />
              <InputField
                name="email"
                label="E-posta"
                placeholder={'E-posta adresinizi girin'}
              />
              <div className="flex items-center justify-start my-2">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-sm"
                >
                  Devam Et
                </button>
              </div>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default memo(StepOne);
