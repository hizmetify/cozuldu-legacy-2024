import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useMemo, useState, useCallback } from 'react';
import Stepper from '../components/UI/Stepper';
import ButtonGroup from '../components/UI/ButtonGroup';
import { motion, AnimatePresence } from 'framer-motion';

const STEP_PATHS = ['/register/step-1', '/register/step-2', '/register/step-3'];
const STEP_TITLES = [
  'Kişisel Bilgiler',
  'İletişim ve Profil',
  'Şifre Belirleme',
];
const STEP_DESCRIPTIONS = [
  'Lütfen kişisel bilgilerinizi girin.',
  'İletişim bilgilerinizi ve profil detaylarınızı girin.',
  'Güvenli bir şifre oluşturun.',
];
const pageAnimations = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
  transition: { duration: 0.3 },
};

const RegisterLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentStepIndex = useMemo(
    () => STEP_PATHS.indexOf(location.pathname),
    [location.pathname]
  );
  const handlePrevious = useCallback(() => {
    if (currentStepIndex > 0) {
      navigate(STEP_PATHS[currentStepIndex - 1]);
    }
  }, [currentStepIndex, navigate]);

  const handleNext = useCallback(() => {
    const formId = `stepForm-${currentStepIndex}`;
    const stepForm = document.getElementById(formId);
    if (stepForm) {
      setIsSubmitting(true);
      stepForm.requestSubmit();
    }
  }, [currentStepIndex]);

  const outletContext = useMemo(
    () => ({
      setIsSubmitting,
    }),
    []
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      <div className="md:w-[35%] lg:w-[30%] md:min-h-screen h-[180px] md:h-auto">
        <Stepper currentStepIndex={currentStepIndex} />
      </div>

      <div className="w-full md:w-[65%] lg:w-[70%] flex flex-col p-6 md:p-12">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            {STEP_TITLES[currentStepIndex]}
          </h1>
          <p className="text-gray-500 mt-2">
            {STEP_DESCRIPTIONS[currentStepIndex]}
          </p>
        </div>

        <div className="flex-grow bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={location.pathname}
              initial={pageAnimations.initial}
              animate={pageAnimations.animate}
              exit={pageAnimations.exit}
              transition={pageAnimations.transition}
              className="h-full"
            >
              <Outlet context={outletContext} />
            </motion.div>
          </AnimatePresence>
        </div>

        <ButtonGroup
          currentStep={currentStepIndex + 1}
          totalSteps={STEP_PATHS.length}
          onPrevious={handlePrevious}
          onNext={handleNext}
          isSubmitting={isSubmitting}
        />

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            Adım {currentStepIndex + 1} / {STEP_PATHS.length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterLayout;
