import { memo } from 'react';
import { Formik, Form } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { stepThreeValidationSchema } from '../../validations/userValidation';
import { showToast } from '../../features/toast/toastSlice';
import { updateRegisterData } from '../../features/register/registerSlice';
import { register } from '../../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import InputField from '../UI/InputField';
import ButtonGroup from '../UI/ButtonGroup';

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
      onSubmit={async (values, { setSubmitting, setErrors }) => {
        dispatch(updateRegisterData(values));

        try {
          const finalData = {
            ...registerData,
            ...values,
          };

          await dispatch(register(finalData)).unwrap();
          dispatch(showToast({ message: 'Kayıt başarılı!', type: 'success' })); 
          navigate('/dashboard');
        } catch (error) {
          dispatch(showToast({ message: error, type: 'error' })); 
        }

        setSubmitting(false);
      }}
    >
      {({ validateForm, handleSubmit, isSubmitting, setErrors }) => {
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
          <Form className="flex flex-col h-full">
            <div className="flex flex-col gap-3 flex-grow mt-7">
              <InputField name="password" label="Şifre" type="password" />
              <InputField
                name="confirmPassword"
                label="Şifre (Tekrar)"
                type="password"
              />
            </div>

            <div className="mt-auto">
              <ButtonGroup
                currentStep={3}
                totalSteps={3}
                onPrevious={() => navigate('/register/step-2')}
                onNext={customSubmit}
                isSubmitting={isSubmitting}
              />
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default memo(StepThree);
