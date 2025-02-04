import PropTypes from 'prop-types';

const ButtonGroup = ({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  isSubmitting,
}) => {
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
        {currentStep === totalSteps ? 'Kaydı Tamamla' : 'Devam Et'}
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
};

export default ButtonGroup;
