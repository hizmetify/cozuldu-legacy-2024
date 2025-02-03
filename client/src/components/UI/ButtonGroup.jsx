// ButtonGroup.jsx
import PropTypes from 'prop-types';

const ButtonGroup = ({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  isSubmitting,
}) => {
  return (
    <div className="flex items-center justify-between mt-4">
      {currentStep > 1 && (
        <button
          type="button"
          onClick={onPrevious}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-sm hover:bg-gray-400 transition"
        >
          Geri
        </button>
      )}
      <button
        type="button" // submit yerine button tipi kullanalım.
        onClick={onNext} // onNext fonksiyonunu ekliyoruz.
        disabled={isSubmitting}
        className={`px-4 py-2 rounded-sm transition ${
          isSubmitting
            ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
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
  onNext: PropTypes.func, // onNext artık kullanılacak.
  isSubmitting: PropTypes.bool,
};

export default ButtonGroup;
