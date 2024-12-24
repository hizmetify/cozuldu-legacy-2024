/* 

const SelectField = ({ label, name, options, ...rest }) => {
  return (
    <div>
      <label htmlFor={name} className="block mb-2 font-medium">
        {label}
      </label>

      <select
        id={name}
        name={name}
        className="border border-gray-300 outline-none rounded-md p-2 w-full"
        {...rest}
      >
        <option value="">Şehir Seçin</option>
        {options.map((option) => (
          <option key={option._id} value={option.name}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectField; */

import { Field } from 'formik';

const SelectField = ({ label, name, options, ...rest }) => {
  return (
    <div className="mb-4">
      <label
        htmlFor={name}
        className="block text-sm text-muted-foreground mb-1"
      >
        {label}
      </label>
      <Field
        as="select"
        name={name}
        id={name}
        className="w-full py-2 bg-transparent border-0 border-b-2 border-muted 
            focus:border-indigo-500 focus:outline-none transition-colors duration-200
            text-base text-primary"
        {...rest}
      >
        <option value="" disabled>
          Lütfen bir şehir seçin
        </option>
        {options.map((option, index) => (
          <option key={index} value={option.name}>
            {option.name}
          </option>
        ))}
      </Field>
    </div>
  );
};

export default SelectField;
