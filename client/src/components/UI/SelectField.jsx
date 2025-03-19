import PropTypes from 'prop-types';
import { Field } from 'formik';
import { IoChevronDown } from 'react-icons/io5';

const SelectField = ({
  label,
  name,
  options,
  placeholder = 'Lütfen bir seçim yapın',
  ...rest
}) => {
  return (
    <div className="mb-4 relative">
      <label htmlFor={name} className="block text-sm text-gray-700 mb-1">
        {label}
      </label>

      <div className="relative">
        <Field
          as="select"
          name={name}
          id={name}
          className={`
            w-full py-2 bg-transparent border-0 border-b-2 border-gray-300
            focus:border-indigo-500 focus:outline-none
            transition-colors duration-200
            text-sm text-gray-900 lg:text-base
            appearance-none cursor-pointer
          `}
          {...rest}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.name}
            </option>
          ))}
        </Field>
        <IoChevronDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
};

SelectField.propTypes = {
  label: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
    })
  ).isRequired,
  placeholder: PropTypes.string,
};

export default SelectField;
