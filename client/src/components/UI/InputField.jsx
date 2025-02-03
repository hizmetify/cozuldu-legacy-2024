import { Field } from 'formik';
import PropTypes from 'prop-types';

const InputField = ({ label, name, type, placeholder }) => {
  return (
    <div>
      <label htmlFor={name} className="block text-sm text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <Field
          id={name}
          placeholder={placeholder}
          type={type}
          name={name}
          autoComplete="off"
          className="w-full py-2 bg-transparent border-0 border-b-2 border-gray-300 
            focus:border-blue-700 focus:outline-none transition-colors duration-200 
            text-sm text-gray-900 lg:text-base"
        />
      </div>
    </div>
  );
};

InputField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  placeholder: PropTypes.string,
};

InputField.defaultProps = {
  type: 'text',
  placeholder: '',
};

export default InputField;
