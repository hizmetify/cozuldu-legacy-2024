import { FaCheck } from 'react-icons/fa6';
import { memo, useMemo } from 'react';
import PropTypes from 'prop-types';

const steps = [
  { step: 1, title: 'Kişisel Bilgiler', path: '/register/step-1' },
  { step: 2, title: 'İletişim ve Profil', path: '/register/step-2' },
  { step: 3, title: 'Şifre Belirleme', path: '/register/step-3' },
];

const StepIndicator = ({ step, index, currentStepIndex }) => {
  const isCompleted = index < currentStepIndex;
  const isActive = index === currentStepIndex;

  const circleStyles = useMemo(() => {
    let styles =
      'flex items-center justify-center w-12 h-12 rounded-full text-lg font-bold transition-all duration-300 ';
    if (isCompleted) {
      styles += 'bg-blue-600 text-white border-4 border-blue-600';
    } else if (isActive) {
      styles += 'bg-white text-blue-600 border-4 border-blue-600';
    } else {
      styles += 'bg-gray-200 text-gray-500 border-4 border-gray-300';
    }
    return styles;
  }, [isCompleted, isActive]);

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className={circleStyles}>
        {isCompleted ? (
          <FaCheck className="text-white text-xl" />
        ) : (
          <span>{step.step}</span>
        )}
      </div>
      <span
        className={`text-sm font-medium ${
          isActive ? 'text-blue-600 font-semibold' : 'text-gray-500'
        }`}
      >
        {step.title}
      </span>
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
    <div className="px-6 py-4 flex items-center justify-between">
      {steps.map((step, index) => (
        <StepIndicator
          key={index}
          step={step}
          index={index}
          currentStepIndex={currentStepIndex}
        />
      ))}
    </div>
  );
};

Stepper.propTypes = {
  currentStepIndex: PropTypes.number.isRequired,
};

export default memo(Stepper);
