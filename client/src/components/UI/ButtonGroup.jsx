import PropTypes from 'prop-types';
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa6';

const ButtonGroup = ({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  isSubmitting,
  isMobile,
}) => {
  const currentStepIndex = currentStep - 1;
  const isLastStep = currentStep === totalSteps;

  if (isMobile) {
    return (
      <div className="flex justify-between mt-4">
        <button
          type="button"
          onClick={onPrevious}
          className={`flex items-center px-3 py-1.5 rounded-lg text-sm
            ${
              currentStepIndex > 0
                ? 'bg-white/10 text-white hover:bg-white/20'
                : 'bg-white/5 text-blue-200/50 cursor-not-allowed'
            }`}
          disabled={currentStepIndex === 0}
        >
          <FaChevronLeft className="mr-1 text-xs" /> Önceki
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={isSubmitting}
          className="flex items-center px-3 py-1.5 bg-white text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-50"
        >
          {isLastStep ? (
            'Tamamla'
          ) : (
            <>
              Sonraki <FaChevronRight className="ml-1 text-xs" />
            </>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="mt-6 pt-4 flex items-center justify-between">
      {currentStep > 1 && (
        <button
          type="button"
          onClick={onPrevious}
          className="
            bg-gray-100 
            text-gray-600 
            border border-gray-300 
            rounded-sm
            px-4 py-2 
            hover:bg-gray-200 
            transition-all 
            duration-200
          "
        >
          Geri
        </button>
      )}
      <button
        type="button"
        onClick={onNext}
        disabled={isSubmitting}
        className={`
          relative 
          overflow-hidden 
          px-5 py-2 
          rounded-sm
          text-white
          transition-all 
          duration-200 
          ${
            isSubmitting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:scale-105 shadow-md'
          }
        `}
      >
        {isLastStep ? 'Kaydı Tamamla' : 'Devam Et'}
      </button>
    </div>
  );
};

ButtonGroup.propTypes = {
  currentStep: PropTypes.number.isRequired,
  totalSteps: PropTypes.number.isRequired,
  onPrevious: PropTypes.func.isRequired,
  onNext: PropTypes.func,
  isSubmitting: PropTypes.bool,
  isMobile: PropTypes.bool,
};

ButtonGroup.defaultProps = {
  isSubmitting: false,
  isMobile: false,
};

export default ButtonGroup;
