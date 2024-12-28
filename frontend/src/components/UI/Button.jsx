import PropTypes from 'prop-types';

const sizeClasses = {
  small: 'py-1 px-4 text-sm',
  medium: 'py-2 px-7 text-base',
  large: 'py-3 px-10 text-lg',
};

const variantClasses = {
  primary: 'bg-blue-500 text-white hover:bg-blue-600',
  secondary: 'bg-gray-300 text-black hover:bg-gray-400',
};

const Button = ({
  children,
  size = 'medium',
  onClick,
  variant = 'primary',
  disabled,
}) => {
  return (
    <button
      onClick={onClick}
      className={`font-medium rounded transition-colors duration-300 ${
        sizeClasses[size]
      } ${variantClasses[variant]}            ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }                      `}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  variant: PropTypes.oneOf(['primary', 'secondary']),
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
};

export default Button;
