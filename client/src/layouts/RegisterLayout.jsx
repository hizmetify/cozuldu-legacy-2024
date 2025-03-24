import { Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import { useMemo, useState, useCallback } from 'react';
import Stepper from '../components/UI/Stepper';
import ButtonGroup from '../components/UI/ButtonGroup';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHome, FaSignInAlt } from 'react-icons/fa';

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
      <div className="md:hidden flex justify-between items-center p-4 bg-white border-b border-gray-200">
        <Link
          to="/"
          className="flex items-center text-gray-600 hover:text-blue-600 text-sm font-medium transition-colors"
        >
          <FaHome className="mr-1" />
          <span>Ana Sayfa</span>
        </Link>
        <Link
          to="/login"
          className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
        >
          <FaSignInAlt className="mr-1" />
          <span>Giriş Yap</span>
        </Link>
      </div>

      <div className="md:w-[35%] lg:w-[30%] md:min-h-screen h-[180px] md:h-auto relative">
        <Stepper currentStepIndex={currentStepIndex} />
        <div className="hidden md:flex absolute top-4 right-4 space-x-2 z-10">
          <Link
            to="/"
            className="flex items-center justify-center px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg backdrop-blur-sm border border-white/20 transition-all duration-300 text-xs"
          >
            <FaHome className="mr-1" />
            <span>Ana Sayfa</span>
          </Link>
          <Link
            to="/login"
            className="flex items-center justify-center px-3 py-1.5 bg-white text-blue-600 hover:bg-blue-50 rounded-lg shadow-md transition-all duration-300 text-xs"
          >
            <FaSignInAlt className="mr-1" />
            <span>Giriş Yap</span>
          </Link>
        </div>
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

        <div className="mt-6 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-gray-500">
            Adım {currentStepIndex + 1} / {STEP_PATHS.length}
          </p>

          <div className="hidden md:flex mt-4 md:mt-0 space-x-1 text-sm">
            <span className="text-gray-500">Hesabınız var mı?</span>
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Giriş yapın
            </Link>
          </div>
        </div>
        <div className="md:hidden mt-6 text-center">
          <div className="flex justify-center items-center space-x-1 text-sm">
            <span className="text-gray-500">Hesabınız var mı?</span>
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Giriş yapın
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterLayout;
