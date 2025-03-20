import { Field } from 'formik';
import PropTypes from 'prop-types';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const PhoneInputField = ({ label, name }) => {
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
          <div className="relative">
            <PhoneInput
              country="tr"
              value={field.value}
              onChange={(phone) => form.setFieldValue(name, phone)}
              inputProps={{
                name,
                autoComplete: 'off',
                className: 'form-control',
              }}
              containerClass="phone-input-container"
              buttonClass="phone-input-button"
              dropdownClass="phone-input-dropdown"
              countryCodeEditable={false}
            />
          </div>
        )}
      </Field>

      <style jsx global>{`
        .phone-input-container {
          position: relative;
          width: 100%;
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
          border-bottom: 2px solid #e5e7eb;
          outline: none;
          padding: 0.5rem 0 0.5rem 3.5rem;
          transition: border-color 0.2s;
          border-radius: 0 !important;
        }

        .phone-input-container .form-control:focus {
          border-bottom-color: #2563eb;
          box-shadow: none;
        }

        .phone-input-dropdown {
          margin-top: 0.5rem;
          border: 1px solid #e5e7eb;

          border-radius: 0 !important;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .phone-input-dropdown .country {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          cursor: pointer;
          transition: background-color 0.15s ease-in-out;
        }

        .phone-input-dropdown .country:hover {
          background-color: rgba(0, 0, 0, 0.05);
        }
      `}</style>
    </div>
  );
};

PhoneInputField.propTypes = {
  label: PropTypes.node,
  name: PropTypes.string.isRequired,
};

export default PhoneInputField;
