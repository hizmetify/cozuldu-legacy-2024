import { Outlet, useLocation } from 'react-router-dom';
import { FaCheck } from 'react-icons/fa6';

const steps = [
  { step: 1, title: '1. Adım', path: '/register/step-1' },
  { step: 2, title: '2. Adım', path: '/register/step-2' },
  { step: 3, title: '3. Adım', path: '/register/step-3' },
];

const RegisterLayout = () => {
  const location = useLocation();
  const currentStepIndex = steps.findIndex(
    (step) => step.path === location.pathname
  );

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded shadow-lg overflow-hidden border border-gray-200 h-[500px] md:h-[550px] lg:h-[600px] flex flex-col">
        <div className="px-8 py-6 flex-grow">
          <div className="relative flex items-center justify-between mb-8">
            <div className="absolute top-1/2 left-0 w-full -translate-y-1/2">
              <div className="w-full border-t border-gray-300"></div>
            </div>

            {steps.map((step, index) => {
              const isCompleted = index < currentStepIndex;
              const isActive = index === currentStepIndex;

              let circleStyles =
                'flex items-center justify-center w-10 h-10 rounded-full text-lg font-semibold transition-all duration-300 ';
              if (isCompleted) {
                circleStyles +=
                  'bg-blue-600 text-white border-2 border-blue-600 shadow-md';
              } else if (isActive) {
                circleStyles +=
                  'bg-blue-50 text-blue-600 border-2 border-blue-600 shadow-sm';
              } else {
                circleStyles +=
                  'bg-neutral-100 text-neutral-400 border-2 border-gray-300';
              }

              return (
                <div
                  key={index}
                  className="z-10 flex justify-center flex-col items-center"
                >
                  <div className={circleStyles}>
                    {isCompleted ? (
                      <FaCheck />
                    ) : (
                      <div className="flex ">
                        <span>{step.step}</span>
                      </div>
                    )}
                  </div>
                  
                </div>
              );
            })}
          </div>
        </div>

        <div className="px-8 py-6 flex-grow overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default RegisterLayout;
