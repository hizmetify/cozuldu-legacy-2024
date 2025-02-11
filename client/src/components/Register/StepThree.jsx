// StepThree.jsx
import { memo } from 'react';
import { Formik, Form } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { updateRegisterData } from '../../features/register/registerSlice';
import { register } from '../../features/auth/authSlice';
import { showToast } from '../../features/toast/toastSlice';
import { stepThreeValidationSchema } from '../../validations/userValidation';

import InputField from '../UI/InputField';

const StepThree = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const registerData = useSelector((state) => state.register.data);

  const { password, confirmPassword } = registerData;
  const initialValues = { password, confirmPassword };
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      dispatch(updateRegisterData(values));
      const finalData = { ...registerData, ...values };

      await dispatch(register(finalData)).unwrap();
      dispatch(showToast({ message: 'Kayıt başarılı!', type: 'success' }));
      navigate('/dashboard');
    } catch (error) {
      dispatch(showToast({ message: error, type: 'error' }));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={stepThreeValidationSchema}
      validateOnChange={false}
      validateOnBlur={false}
      onSubmit={handleSubmit}
    >
      {({ validateForm, handleSubmit, setSubmitting, setErrors }) => {
        const customSubmit = async (e) => {
          if (e) e.preventDefault();
          const errors = await validateForm();
          if (Object.keys(errors).length > 0) {
            setErrors(errors);
            Object.values(errors).forEach((errMsg) => {
              dispatch(showToast({ message: errMsg, type: 'error' }));
            });
          } else {
            setSubmitting(true);
            await handleSubmit(); 
          }
        };

        return (
          <Form id="stepForm-2" onSubmit={customSubmit} className="flex flex-col h-full">
            <div className="flex flex-col gap-3 flex-grow mt-7">
              <InputField name="password" label="Şifre" type="password" />
              <InputField name="confirmPassword" label="Şifre (Tekrar)" type="password" />
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default memo(StepThree);
