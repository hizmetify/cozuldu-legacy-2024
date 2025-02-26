import { Field } from 'formik';
import PropTypes from 'prop-types';

const InputField = ({ label, name, type, placeholder }) => {
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
      <div className="relative">
        <Field
          id={name}
          placeholder={placeholder}
          type={type}
          name={name}
          autoComplete="off"
          className="w-full py-2.5 bg-transparent border-0 border-b-2 border-gray-200 
            focus:border-blue-600 outline-none focus:outline-none
            transition-all duration-300
            text-gray-800 placeholder-gray-400"
        />
      </div>
    </div>
  );
};

InputField.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  placeholder: PropTypes.string,
};

InputField.defaultProps = {
  type: 'text',
  placeholder: '',
  label: '',
};

export default InputField;
