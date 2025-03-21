import { Field } from 'formik';
import PropTypes from 'prop-types';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useState, memo, useCallback } from 'react';

const phoneInputStyles = `
  .phone-input-container {
    position: relative;
    width: 100%;
    border-radius: 0.5rem;
    overflow: hidden;
    background-color: rgb(249, 250, 251);
    border-bottom: 2px solid #e5e7eb;
    transition: all 0.3s;
  }
  
  .phone-input-container.focused {
    border-bottom-color: #2563eb;
    background-color: rgba(219, 234, 254, 0.3);
  }
  
  .phone-input-container.error {
    border-bottom-color: #f87171;
    background-color: rgb(254, 242, 242);
  }

  .phone-input-button {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    padding: 0 0.75rem;
    background: transparent !important;
    border: none !important;
    cursor: pointer;
    transition: background-color 0.15s ease-in-out;
    border-radius: 0 !important;
    z-index: 2;
  }

  .phone-input-button .selected-flag {
    background-color: transparent !important;
    border: none !important;
  }

  .phone-input-button:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }

  .phone-input-button .arrow {
    display: none;
  }

  .phone-input-container .form-control {
    width: 100%;
    background: transparent;
    border: none;
    outline: none;
    padding: 0.75rem 0 0.75rem 3.5rem;
    transition: all 0.2s;
    border-radius: 0.5rem !important;
    font-size: 0.875rem;
  }

  .phone-input-container .form-control:focus {
    box-shadow: none;
  }

  .react-tel-input .country-list {
    z-index: 50 !important;
    margin-top: 0.5rem;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem !important;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }

  .phone-input-dropdown {
    z-index: 50 !important;
  }

  .react-tel-input .country-list .country {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    cursor: pointer;
    transition: background-color 0.15s ease-in-out;
  }

  .react-tel-input .country-list .country:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
  
  .react-tel-input {
    position: relative;
    font-family: inherit;
    z-index: 5;
  }
  
  .react-tel-input.open {
    z-index: 30;
  }
`;

const PhoneInputField = ({ label, name, error, icon: Icon }) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback((e, form) => {
    setIsFocused(false);
    form.handleBlur(e);
  }, []);

  const handleChange = useCallback(
    (phone, form) => {
      form.setFieldValue(name, phone);
    },
    [name]
  );

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
      <Field name={name}>
        {({ field, form }) => (
          <div
            className={`relative transition-all duration-300 ${
              isFocused ? 'scale-[1.01]' : ''
            }`}
          >
            {Icon && (
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10">
                <Icon size={18} />
              </div>
            )}
            <PhoneInput
              country="tr"
              value={field.value}
              onChange={(phone) => handleChange(phone, form)}
              inputProps={{
                name,
                autoComplete: 'off',
                className: `form-control ${Icon ? 'pl-10' : ''}`,
                onFocus: handleFocus,
                onBlur: (e) => handleBlur(e, form),
              }}
              containerClass={`phone-input-container ${error ? 'error' : ''} ${
                isFocused ? 'focused' : ''
              }`}
              buttonClass="phone-input-button"
              dropdownClass="phone-input-dropdown"
              countryCodeEditable={false}
              disableSearchIcon={true}
              disableDropdown={false}
              enableSearch={false}
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
        )}
      </Field>

      {error && <div className="text-sm text-red-500 mt-1 pl-1">{error}</div>}

      <style jsx global>
        {phoneInputStyles}
      </style>
    </div>
  );
};

PhoneInputField.propTypes = {
  label: PropTypes.node,
  name: PropTypes.string.isRequired,
  error: PropTypes.string,
  icon: PropTypes.elementType,
};

PhoneInputField.defaultProps = {
  label: '',
  error: null,
  icon: null,
};
export default memo(PhoneInputField);
