import PropTypes from 'prop-types';
import { memo } from 'react';

const LoadingSpinner = memo(() => (
  <span className="flex items-center">
    <svg
      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
    İşleniyor...
  </span>
));

const StepIndicators = memo(({ currentStep, totalSteps }) => (
  <div className="flex items-center gap-1">
    {Array.from({ length: totalSteps }).map((_, index) => (
      <div
        key={index}
        className={`w-2 h-2 rounded-full transition-all duration-300 ${
          index + 1 === currentStep
            ? 'bg-blue-600 scale-125'
            : index + 1 < currentStep
            ? 'bg-blue-400'
            : 'bg-gray-300'
        }`}
      ></div>
    ))}
  </div>
));

StepIndicators.propTypes = {
  currentStep: PropTypes.number.isRequired,
  totalSteps: PropTypes.number.isRequired,
};

const ButtonGroup = ({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  isSubmitting,
}) => {
  const prevButtonClass = `px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
    ${
      currentStep === 1
        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
    }
  `;

  const nextButtonClass = `px-6 py-2.5 rounded-lg text-sm font-medium text-white transition-all duration-200
    ${
      isSubmitting
        ? 'bg-blue-400 cursor-not-allowed'
        : 'bg-blue-600 hover:bg-blue-700'
    }
    ${currentStep === totalSteps ? 'bg-green-600 hover:bg-green-700' : ''}
  `;

  return (
    <div className="flex justify-between items-center">
      <button
        type="button"
        onClick={onPrevious}
        disabled={currentStep === 1 || isSubmitting}
        className={prevButtonClass}
      >
        Geri
      </button>

      <div className="hidden sm:block">
        <StepIndicators currentStep={currentStep} totalSteps={totalSteps} />
      </div>

      <button
        type="button"
        onClick={onNext}
        disabled={isSubmitting}
        className={nextButtonClass}
      >
        {isSubmitting ? (
          <LoadingSpinner />
        ) : currentStep === totalSteps ? (
          'Tamamla'
        ) : (
          'Devam Et'
        )}
      </button>
    </div>
  );
};

ButtonGroup.propTypes = {
  currentStep: PropTypes.number.isRequired,
  totalSteps: PropTypes.number.isRequired,
  onPrevious: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool,
};

ButtonGroup.defaultProps = {
  isSubmitting: false,
};

export default memo(ButtonGroup);
