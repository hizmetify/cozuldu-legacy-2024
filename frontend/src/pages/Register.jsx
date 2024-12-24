import { useState } from 'react';
import { Formik, Form } from 'formik';
import { useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import Stepper from '../components/UI/Stepper';
import StepOne from '../components/forms/StepOne';
import StepTwo from '../components/forms/StepTwo';
import StepThree from '../components/forms/StepThree';
import {
  stepOneValidationSchema,
  stepTwoValidationSchema,
  stepThreeValidationSchema,
} from '../validations/userValidations';
import FormLayout from '../layouts/FormLayout';

const steps = [
  { name: 'Adım 1', component: StepOne, validation: stepOneValidationSchema },
  { name: 'Adım 2', component: StepTwo, validation: stepTwoValidationSchema },
  { name: 'Adım 3', component: StepThree, validation: stepThreeValidationSchema },
];

const Register = () => {
  const [currentStep, setCurrentStep] = useState(0);

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
      await steps[currentStep].validation.validate(values, { abortEarly: false });
      return true;
    } catch (errors) {
      errors.inner.forEach((error) => {
        toast.error(error.message); 
      });
      return false;
    }
  };

  const handleSubmit = (values) => {
    toast.success('Kayıt Başarılı! Bilgiler doğru bir şekilde kaydedildi.');
    console.log('Form Verileri:', values);
  };

  const ActiveStep = steps[currentStep].component;

  return (
    <FormLayout>
      <h1 className="text-3xl font-bold text-center mb-8">Kayıt Ol</h1>
      <Stepper steps={steps} currentStep={currentStep} />

      <Formik
        initialValues={initialValues}
        onSubmit={async (values) => {
          const isValid = await handleValidationErrors(values);
          if (isValid) {
            if (currentStep === steps.length - 1) {
              handleSubmit(values);
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
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
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
