import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import Stepper from '../components/UI/Stepper';
import ButtonGroup from '../components/UI/ButtonGroup';

const STEP_PATHS = ['/register/step-1', '/register/step-2', '/register/step-3'];

const RegisterLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const currentStepIndex = useMemo(
    () => STEP_PATHS.indexOf(location.pathname),
    [location.pathname]
  );

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      navigate(STEP_PATHS[currentStepIndex - 1]);
    }
  };
  const handleNext = () => {
    const formId = `stepForm-${currentStepIndex}`;
    const stepForm = document.getElementById(formId);
    if (stepForm) {
      stepForm.requestSubmit();
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-[35%] lg:w-[30%] md:min-h-screen">
        <Stepper currentStepIndex={currentStepIndex} />
      </div>
      <div className="w-full md:w-[65%] lg:w-[70%] flex flex-col p-6 md:p-12">
        <Outlet />
        <ButtonGroup
          currentStep={currentStepIndex + 1}
          totalSteps={STEP_PATHS.length}
          onPrevious={handlePrevious}
          onNext={handleNext}
          isSubmitting={false}
        />
      </div>
    </div>
  );
};

export default RegisterLayout;
