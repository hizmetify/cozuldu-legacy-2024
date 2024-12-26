import { useState } from 'react';
import { Formik, Form } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import Stepper from '../components/UI/Stepper';
import StepOne from '../components/forms/StepOne';
import StepTwo from '../components/forms/StepTwo';
import StepThree from '../components/forms/StepThree';
import { useNavigate } from 'react-router-dom';
import {
  stepOneValidationSchema,
  stepTwoValidationSchema,
  stepThreeValidationSchema,
} from '../validations/userValidations';
import FormLayout from '../layouts/FormLayout';
import { register } from '../features/authSlice';

const steps = [
  { name: 'Adım 1', component: StepOne, validation: stepOneValidationSchema },
  { name: 'Adım 2', component: StepTwo, validation: stepTwoValidationSchema },
  {
    name: 'Adım 3',
    component: StepThree,
    validation: stepThreeValidationSchema,
  },
];

const Register = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth);

  const initialValues = {
    name: '',
    lastname: '',
    email: '',
    phone: '',
    city: '',
    profilePic: '',
    portfolioLink: '',
    password: '',
    confirmPassword: '',
  };

  const handleNext = () => setCurrentStep((prev) => prev + 1);
  const handleBack = () => setCurrentStep((prev) => prev - 1);

  const handleValidationErrors = async (values) => {
    try {
      await steps[currentStep].validation.validate(values, {
        abortEarly: false,
      });
      return true;
    } catch (errors) {
      errors.inner.forEach((error) => {
        toast.error(error.message);
      });
      return false;
    }
  };

  const handleSubmit = async (values) => {
    try {
      await dispatch(register(values)).unwrap();
      toast.success('Kayıt başarılı!');
      navigate('/dashboard');
      setCurrentStep(0);
    } catch (err) {
      toast.error(err);
    }
  };

  const ActiveStep = steps[currentStep].component;

  return (
    <FormLayout>
      <h1 className="text-3xl font-bold text-center mb-8">Kayıt Ol</h1>
      <Stepper steps={steps} currentStep={currentStep} />

      <Formik
        initialValues={initialValues}
        onSubmit={async (values) => {
          console.log(values);
          const isValid = await handleValidationErrors(values);
          if (isValid) {
            if (currentStep === steps.length - 1) {
              await handleSubmit(values);
            } else {
              handleNext();
            }
          }
        }}
        validateOnBlur={false}
        validateOnChange={false}
      >
        {() => (
          <Form>
            <ActiveStep />
            <div className="flex justify-between mt-6">
              {currentStep > 0 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="bg-gray-300 hover:bg-gray-400 text-black font-medium py-2 px-4 rounded"
                >
                  Geri
                </button>
              )}
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-7 rounded-sm"
              >
                {currentStep === steps.length - 1 ? 'Kaydı Tamamla' : 'İleri'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </FormLayout>
  );
};

export default Register;
