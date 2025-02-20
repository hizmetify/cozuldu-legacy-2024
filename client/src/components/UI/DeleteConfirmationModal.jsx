import PropTypes from 'prop-types';
import { BiErrorCircle } from 'react-icons/bi';
import { useEffect } from 'react';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, title }) => {
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 transition-all duration-300 animate-in fade-in-0"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-white rounded-2xl shadow-lg max-w-md w-[90%] sm:w-[400px] transform transition-all duration-300 scale-100 animate-in zoom-in-95 p-6">
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center mb-4">
            <BiErrorCircle size={24} className="text-amber-500" />
            <div className="absolute w-12 h-12 bg-amber-200/50 rounded-full blur-md -z-10" />
          </div>

          <h2
            id="modal-title"
            className="text-[22px] font-semibold text-gray-800 mb-2"
          >
            {title}
          </h2>

          <p className="text-gray-500 text-[15px] leading-relaxed mb-6">
            Bu işlemi geri alamayacaksınız. Onaylıyor musunuz?
          </p>

          <div className="flex gap-3 w-full">
            <button
              className="flex-1 px-4 py-2.5 rounded-lg text-[15px] font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-200 transition-colors duration-200"
              onClick={onClose}
            >
              İptal
            </button>
            <button
              className="flex-1 px-4 py-2.5 rounded-lg text-[15px] font-medium text-white bg-purple-500 hover:bg-purple-600 transition-colors duration-200"
              onClick={onConfirm}
            >
              Sil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

DeleteConfirmationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

export default DeleteConfirmationModal;
