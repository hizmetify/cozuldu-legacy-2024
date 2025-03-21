import { Field } from 'formik';
import PropTypes from 'prop-types';
import { useState, memo, useCallback } from 'react';

const InputField = ({
  label,
  name,
  type,
  placeholder,
  error,
  icon: Icon,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback((e) => {
    setIsFocused(false);
    e.target.form.dispatchEvent(new Event('blur', { bubbles: true }));
  }, []);

  return (
    <div className="space-y-2">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      <div
        className={`relative transition-all duration-300 ${
          isFocused ? 'scale-[1.01]' : ''
        }`}
      >
        {Icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Icon size={18} />
          </div>
        )}
        <Field
          id={name}
          placeholder={placeholder}
          type={type}
          name={name}
          autoComplete="off"
          className={`w-full py-3 px-4 ${
            Icon ? 'pl-10' : ''
          } bg-gray-50 border-0 border-b-2 
            ${
              error
                ? 'border-red-400 bg-red-50'
                : isFocused
                ? 'border-blue-600 bg-blue-50/30'
                : 'border-gray-200'
            } 
            rounded-lg focus:border-blue-600 outline-none focus:outline-none
            transition-all duration-300
            text-gray-800 placeholder-gray-400`}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...rest}
        />

        {error && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
      </div>

      {error && <div className="text-sm text-red-500 mt-1 pl-1">{error}</div>}
    </div>
  );
};

InputField.propTypes = {
  label: PropTypes.node,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  icon: PropTypes.elementType,
};

InputField.defaultProps = {
  type: 'text',
  placeholder: '',
  label: '',
  error: null,
  icon: null,
};

export default memo(InputField);
