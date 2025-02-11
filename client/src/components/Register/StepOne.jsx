import { memo } from 'react';
import { Formik, Form } from 'formik';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { showToast } from '../../features/toast/toastSlice';
import { updateRegisterData } from '../../features/register/registerSlice';
import { stepOneValidationSchema } from '../../validations/userValidation';
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
        dispatch(
          showToast({
            message: 'Adım 1 başarıyla tamamlandı!',
            type: 'success',
          })
        );
        navigate('/register/step-2');
      }}
    >
      {({ validateForm, handleSubmit, setErrors }) => {
        const customSubmit = async (e) => {
          if (e) e.preventDefault();
          const validationErrors = await validateForm();

          if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            Object.entries(validationErrors).forEach(([_, errorMsg]) => {
              dispatch(showToast({ message: errorMsg, type: 'error' }));
            });
          } else {
            await handleSubmit();
          }
        };

        return (
          <Form
            id="stepForm-0"
            onSubmit={customSubmit}
            className="flex flex-col h-full"
          >
            <div className="flex flex-col gap-3 flex-grow">
              <InputField
                name="name"
                label="İsim"
                placeholder="Adınızı girin"
              />
              <InputField
                name="lastname"
                label="Soyisim"
                placeholder="Soyadınızı girin"
              />
              <InputField
                name="email"
                label="E-posta"
                placeholder="E-posta adresinizi girin"
              />
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default memo(StepOne);
