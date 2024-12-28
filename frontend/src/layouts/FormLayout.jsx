import {
  loginValidation,
  stepOneValidationSchema,
  stepTwoValidationSchema,
  stepThreeValidationSchema,
} from '../validations/userValidations';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
import Stepper from '../components/UI/Stepper';
import { useEffect, useState } from 'react';

const FormLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  const formsConfig = {
    'step-1': {
      initialValues: {
        name: '',
        lastname: '',
        email: '',
      },
      validationSchema: stepOneValidationSchema,
    },
    'step-2': {
      initialValues: {
        phone: '',
        city: '',
        profilePic: '',
        portfolioLink: '',
      },
      validationSchema: stepTwoValidationSchema,
    },
    'step-3': {
      initialValues: {
        password: '',
        confirmPassword: '',
      },
      validationSchema: stepThreeValidationSchema,
    },
  };

  const path = location.pathname.split('/').pop();
  const currentForm = formsConfig[path] || formsConfig['step-1'];

  useEffect(() => {
    const stepKeys = Object.keys(formsConfig);
    const stepIndex = stepKeys.indexOf(path);
    if (stepIndex !== -1) {
      setCurrentStep(stepIndex);
    }
  }, [path]);

  const handleNext = async (values) => {
    const stepKeys = Object.keys(formsConfig);
    const currentStepValidation = currentForm.validationSchema;

    try {
      await currentStepValidation.validate(values, { abortEarly: false });

      if (currentStep < stepKeys.length - 1) {
        const nextStep = stepKeys[currentStep + 1];
        navigate(`/register/${nextStep}`);
      }
    } catch (validationErrors) {
      console.error('Validation Errors:', validationErrors.errors);
    }
  };

  const handleBack = () => {
    const stepKeys = Object.keys(formsConfig);
    if (currentStep > 0) {
      const previousStep = stepKeys[currentStep - 1];
      navigate(`/register/${previousStep}`);
    }
  };

  const handleSubmit = (values) => {
    if (currentStep === Object.keys(formsConfig).length - 1) {
      console.log('Final Form Values:', values);
    } else {
      handleNext(values);
    }
  };

  return (
    <Formik
      initialValues={currentForm.initialValues}
      validationSchema={currentForm.validationSchema}
      onSubmit={async (values) => {
        if (currentStep === Object.keys(formsConfig).length - 1) {
          console.log('Form Sonlandı: ', values);
        } else {
          await handleNext(values);
        }
      }}
    >
      {({ values }) => (
        <Form>
          <div className="min-h-screen flex items-center justify-center bg-blue-50">
            <div className="w-[500px] h-[650px] flex flex-col justify-between p-6 shadow-md border rounded-lg bg-white">
              <h1 className="text-3xl my-2 font-bold text-center">Kayıt Ol</h1>
              <div className="flex-grow flex flex-col justify-center">
                <div className="mb-6">
                  <Stepper
                    steps={[
                      { name: 'Adım 1' },
                      { name: 'Adım 2' },
                      { name: 'Adım 3' },
                    ]}
                    currentStep={currentStep}
                  />
                </div>

                <div className="flex-grow">
                  <Outlet context={values} />
                </div>
              </div>

              <div className="flex justify-between">
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
                  {currentStep === Object.keys(formsConfig).length - 1
                    ? 'Kaydı Tamamla'
                    : 'İleri'}
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
