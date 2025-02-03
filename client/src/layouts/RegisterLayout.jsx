import { Outlet, useLocation } from 'react-router-dom';
import { useMemo } from 'react';
import Stepper from '../components/UI/Stepper';

const RegisterLayout = () => {
  const location = useLocation();
  const currentStepIndex = useMemo(() => {
    return ['/register/step-1', '/register/step-2', '/register/step-3'].indexOf(
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 h-[500px] md:h-[550px] lg:h-[600px] flex flex-col">
        <Stepper currentStepIndex={currentStepIndex} />
        <div className="px-6 py-4 flex-grow overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default RegisterLayout;
