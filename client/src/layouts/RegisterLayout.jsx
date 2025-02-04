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
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 overflow-hidden">
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none rotate-180">
        <svg
          className="block w-[160%] h-80 text-blue-200"
          viewBox="0 0 1200 320"
          preserveAspectRatio="none"
        >
          <path
            fill="currentColor"
            d="M0,288L48,272C96,256,192,224,288,213.3C384,203,480,213,576,224C672,235,768,245,864,240C960,235,1056,213,1152,213.3C1248,213,1344,235,1392,245.3L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>
      <div className="relative w-full max-w-md mx-auto p-6 bg-white/80 backdrop-blur-md rounded-lg shadow-xl z-10 transition-all duration-300 ease-out">
        <Stepper currentStepIndex={currentStepIndex} />

        <div className="mt-4">
          <Outlet />
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
        <svg
          className="block w-[160%] h-80 text-blue-200"
          viewBox="0 0 1200 320"
          preserveAspectRatio="none"
        >
          <path
            fill="currentColor"
            d="M0,128L40,144C80,160,160,192,240,208C320,224,400,224,480,186.7C560,149,640,75,720,85.3C800,96,880,192,960,224C1040,256,1120,224,1200,208C1280,192,1360,192,1400,192L1440,192L1440,0L1400,0C1360,0,1280,0,1200,0C1120,0,1040,0,960,0C880,0,800,0,720,0C640,0,560,0,480,0C400,0,320,0,240,0C160,0,80,0,40,0L0,0Z"
          />
        </svg>
      </div>
    </div>
  );
};

export default RegisterLayout;
