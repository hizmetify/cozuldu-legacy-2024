import {
  loginValidation,
  stepOneValidationSchema,
  stepTwoValidationSchema,
  stepThreeValidationSchema,
} from '../validations/userValidations';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
import Stepper from '../components/UI/Stepper';
import { useState } from 'react';

const FormLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  const formsConfig = {
    login: {
      initialValues: {
        email: '',
        password: '',
      },
      validationSchema: loginValidation,
    },
    '': {
      initialValues: {
        name: '',
        lastname: '',
        email: '',
      },
      validationSchema: stepOneValidationSchema,
    },
    'step-two': {
      initialValues: {
        phone: '',
        city: '',
        profilePic: '',
        portfolioLink: '',
      },
      validationSchema: stepTwoValidationSchema,
    },
    'step-three': {
      initialValues: {
        password: '',
        confirmPassword: '',
      },
      validationSchema: stepThreeValidationSchema,
    },
  };

  const path = location.pathname.includes('register')
    ? location.pathname.split('/').pop()
    : 'login';

  const currentForm = formsConfig[path] || formsConfig.login;

  const handleNext = () => {
    if (currentStep < 2) {
      setCurrentStep((prev) => prev + 1);
      navigate(`/register/step-${currentStep + 2}`);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      navigate(`/register/step-${currentStep}`);
    }
  };

  const handleSubmit = (values) => {
    console.log('Form Values: ', values);
  };

  return (
    <Formik
      initialValues={currentForm.initialValues}
      validationSchema={currentForm.validationSchema}
      onSubmit={handleSubmit}
    >
      {() => (
        <Form>
          <div className="min-h-screen flex items-center justify-center bg-blue-50">
            <div className="w-full max-w-lg p-6 shadow-md border rounded-lg bg-white">
              <h1 className="text-3xl font-bold text-center mb-8">Kayıt Ol</h1>
              <Stepper
                steps={['Adım 1', 'Adım 2', 'Adım 3']}
                currentStep={currentStep}
              />
              <Outlet />
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
                  onClick={handleNext}
                >
                  {currentStep === 2 ? 'Kaydı Tamamla' : 'İleri'}
                </button>
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default FormLayout;
