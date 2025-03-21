import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const LoadingSpinner = ({ message = 'Yükleniyor', fullScreen = true }) => {
  return (
    <div
      className={`flex items-center justify-center bg-gray-50 ${
        fullScreen ? 'h-screen w-full' : 'h-[70vh] w-full'
      }`}
    >
      <div className="flex flex-col items-center">
        <div className="h-16 w-16 animate-spin rounded-full border-b-4 border-t-4 border-blue-600"></div>
        <motion.p
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.5,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: 'reverse',
          }}
          className="mt-4 text-blue-600"
        >
          {message}...
        </motion.p>
      </div>
    </div>
  );
};

LoadingSpinner.propTypes = {
  message: PropTypes.string,
  fullScreen: PropTypes.bool,
};

export default LoadingSpinner;
