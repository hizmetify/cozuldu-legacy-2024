import { Field } from 'formik';
import { IoChevronDown } from 'react-icons/io5';
const InputField = ({ label, name, type = 'text', placeholder }) => {
  return (
    <div className="mb-4">
      <label
        htmlFor={name}
        className="block text-sm text-muted-foreground mb-1"
      >
        {label}
      </label>
      <div className="relative">
        <Field
          id={name}
          placeholder={placeholder}
          type={type}
          name={name}
          autoComplete="off"
          className="w-full py-2 bg-transparent border-0 border-b-2 border-muted 
            focus:border-indigo-500 focus:outline-none transition-colors duration-200
            text-base text-primary"
        />
        {type === 'select' && <IoChevronDown />}
      </div>
    </div>
  );
};

export default InputField;
