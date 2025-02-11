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
        ? 'bg-teal-500 text-white border-4 border-teal-500'
        : isActive
        ? 'bg-white text-indigo-600 border-4 border-white'
        : 'bg-white/20 text-white border-4 border-white/40'
    }
  `;

  return (
    <div className="flex items-center gap-4">
      <div className={circleStyles}>
        {isCompleted ? <FaCheck className="text-xl" /> : step.step}
      </div>
      <div className="flex flex-col">
        <span className="text-xs font-semibold text-white/50 tracking-wider">
          ADIM {step.step}
        </span>
        <span
          className={`text-sm font-bold tracking-wide ${
            isActive ? 'text-white drop-shadow-md' : 'text-white/80'
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
    <div className="relative w-full h-full bg-gradient-to-b from-gray-900 via-indigo-900 to-black text-white overflow-hidden">
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-400/20 rounded-full blur-3xl" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-teal-400/20 rounded-full blur-3xl" />
      <div className="flex md:hidden px-4 py-4 w-full relative">
        <div className="flex items-center justify-between w-full">
          {steps.map((step, index) => {
            const isCompleted = index < currentStepIndex;
            const isActive = index === currentStepIndex;
            const circleClasses = `
              flex items-center justify-center w-10 h-10 rounded-full 
              text-sm font-medium transition-colors 
              ${
                isCompleted
                  ? 'bg-teal-500 text-white'
                  : isActive
                  ? 'bg-white text-indigo-600'
                  : 'bg-white/20 text-white border border-white/40'
              }
            `;
            return (
              <div
                key={index}
                className="relative flex flex-col items-center flex-1"
              >
                {index < steps.length - 1 && (
                  <div
                    className="absolute top-1/2 right-0 h-0.5 bg-white/30"
                    style={{ width: '100%', zIndex: '-1' }}
                  />
                )}

                <div className={circleClasses}>
                  {isCompleted ? <FaCheck /> : step.step}
                </div>
                <span className="mt-1 text-[10px] text-white/80">
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
