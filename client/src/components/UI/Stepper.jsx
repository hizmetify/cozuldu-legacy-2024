import { FaCheck } from 'react-icons/fa6';
import { memo } from 'react';
import PropTypes from 'prop-types';

const steps = [
  { step: 1, title: 'Kişisel Bilgiler', path: '/register/step-1' },
  { step: 2, title: 'İletişim ve Profil', path: '/register/step-2' },
  { step: 3, title: 'Şifre Belirleme', path: '/register/step-3' },
];

const StepIndicator = ({ step, index, currentStepIndex }) => {
  const isCompleted = index < currentStepIndex;
  const isActive = index === currentStepIndex;

  const circleStyles = `
    flex items-center justify-center w-12 h-12 rounded-full text-lg font-medium 
    shadow-md transition-all duration-300
    ${
      isCompleted
        ? 'bg-blue-700 text-white border-4 border-blue-700'
        : isActive
        ? 'bg-white text-blue-700 border-4 border-blue-700'
        : 'bg-blue-100 text-blue-500 border-4 border-blue-300'
    }
  `;

  return (
    <div className="flex items-center gap-4">
      <div className={circleStyles}>
        {isCompleted ? <FaCheck className="text-xl" /> : step.step}
      </div>
      <div className="flex flex-col">
        <span className="text-xs font-semibold text-blue-700/60 tracking-wider">
          ADIM {step.step}
        </span>
        <span
          className={`text-sm font-bold tracking-wide ${
            isActive ? 'text-blue-700 drop-shadow-md' : 'text-blue-500'
          }`}
        >
          {step.title}
        </span>
      </div>
    </div>
  );
};

StepIndicator.propTypes = {
  step: PropTypes.shape({
    step: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
  currentStepIndex: PropTypes.number.isRequired,
};

const Stepper = ({ currentStepIndex }) => {
  return (
    <div className="relative w-full h-full text-blue-800 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-200 via-blue-100 to-blue-200" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-700/20 rounded-full blur-3xl" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl" />
      <svg
        className="absolute bottom-0 left-0 w-full h-auto text-blue-300"
        viewBox="0 0 1440 320"
      >
        <path
          fill="currentColor"
          fillOpacity="1"
          d="M0,256L48,256C96,256,192,256,288,245.3C384,235,480,213,576,192C672,171,768,149,864,160C960,171,1056,213,1152,208C1248,203,1344,149,1392,122.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        />
      </svg>
      <div className="flex md:hidden px-4 py-4 w-full relative">
        <div className="flex items-center justify-between w-full">
          {steps.map((step, index) => {
            const isCompleted = index < currentStepIndex;
            const isActive = index === currentStepIndex;
            const circleClasses = `
              flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium transition-colors 
              ${
                isCompleted
                  ? 'bg-blue-700 text-white'
                  : isActive
                  ? 'bg-white text-blue-700 border border-blue-700'
                  : 'bg-blue-100 text-blue-500 border border-blue-300'
              }
            `;
            return (
              <div
                key={index}
                className="relative flex flex-col items-center flex-1"
              >
                {index < steps.length - 1 && (
                  <div
                    className="absolute top-1/2 right-0 h-0.5 bg-blue-500/30"
                    style={{ width: '100%', zIndex: '-1' }}
                  />
                )}
                <div className={circleClasses}>
                  {isCompleted ? <FaCheck /> : step.step}
                </div>
                <span className="mt-1 text-[10px] text-blue-700">
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="hidden md:flex flex-col gap-8 p-8 relative z-10">
        {steps.map((step, index) => (
          <StepIndicator
            key={index}
            step={step}
            index={index}
            currentStepIndex={currentStepIndex}
          />
        ))}
      </div>
    </div>
  );
};

Stepper.propTypes = {
  currentStepIndex: PropTypes.number.isRequired,
};

export default memo(Stepper);
