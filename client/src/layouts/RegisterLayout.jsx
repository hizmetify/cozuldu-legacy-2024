import { Outlet, useLocation, useNavigate } from 'react-router-dom';

const steps = [
  { step: 1, title: '1. Adım', path: '/register/step-1' },
  { step: 2, title: '2. Adım', path: '/register/step-2' },
  { step: 3, title: '3. Adım', path: '/register/step-3' },
];

const RegisterLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const currentStepIndex = steps.findIndex(
    (step) => step.path === location.pathname
  );

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      navigate(steps[currentStepIndex + 1].path);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      navigate(steps[currentStepIndex - 1].path);
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-center mb-4">Kayıt Ol</h1>

      <div className="flex justify-between items-center mb-4">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`flex-1 text-center ${
              index === currentStepIndex
                ? 'font-bold text-blue-600'
                : 'text-gray-500'
            }`}
          >
            {step.title}
          </div>
        ))}
      </div>

      <div className="p-4 border rounded">
        <Outlet />
      </div>

    </div>
  );
};

export default RegisterLayout;
