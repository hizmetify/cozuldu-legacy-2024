import { Field } from 'formik';
import { IoChevronDown } from 'react-icons/io5';

const InputField = ({ label, name, type = 'text', placeholder }) => {
  return (
    <div className="mb-4">
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
            focus:border-indigo-500 focus:outline-none transition-colors duration-200
            text-sm text-gray-900 lg:text-base"
        />
        {type === 'select' && (
          <IoChevronDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
        )}
      </div>
    </div>
  );
};

export default InputField;
