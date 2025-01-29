import { Outlet, useLocation } from 'react-router-dom';

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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-md shadow-md overflow-hidden">
        <div className="px-6 py-6">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Kayıt Ol
          </h1>

          <div className="relative flex items-center justify-between mb-8">
            <div className="absolute top-1/2 left-0 w-full -translate-y-1/2">
              <div className="w-full border-t border-gray-200"></div>
            </div>

            {steps.map((step, index) => {
              const isCompleted = index < currentStepIndex;
              const isActive = index === currentStepIndex;

              let circleStyles =
                'flex items-center justify-center w-8 h-8 rounded-full border-2 ';
              if (isCompleted) {
                circleStyles += 'bg-blue-600 border-blue-600 text-white';
              } else if (isActive) {
                circleStyles += 'border-blue-600 text-blue-600';
              } else {
                circleStyles += 'border-gray-300 text-gray-400';
              }

              return (
                <div
                  key={index}
                  className="z-10 flex flex-col items-center"
                >
                  <div className={circleStyles}>
                    {isCompleted ? (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      <span className="text-sm font-semibold">{step.step}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="px-6 py-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default RegisterLayout;
