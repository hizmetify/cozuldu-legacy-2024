import { memo } from 'react';
import { Formik, Form } from 'formik';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { stepOneValidationSchema } from '../../validations/userValidation';
import { useDispatch, useSelector } from 'react-redux';
import { updateRegisterData } from '../../features/register/registerSlice';
import InputField from '../UI/InputField';
import ButtonGroup from '../UI/ButtonGroup';

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
      {({ validateForm, handleSubmit, isSubmitting, setErrors }) => {
        const customSubmit = async (e) => {
          if (e) e.preventDefault();
          const validationErrors = await validateForm();

          if (Object.keys(validationErrors).length > 0) {
            Object.entries(validationErrors).forEach(([field, errorMsg]) => {
              toast.error(errorMsg);
            });
            setErrors(validationErrors);
          } else {
            await handleSubmit();
          }
        };

        return (
          <Form onSubmit={customSubmit} className="flex flex-col h-full">
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

            <div className="mt-auto">
              <ButtonGroup
                currentStep={1}
                totalSteps={3}
                onPrevious={() => navigate('/register/step-1')}
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

export default memo(StepOne);
