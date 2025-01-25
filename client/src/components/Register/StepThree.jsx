import React from 'react';
import { Formik, Form, Field } from 'formik';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { stepThreeValidationSchema } from '../../validations/userValidation';

const StepThree = () => {
  const navigate = useNavigate();

  return (
    <Formik
      initialValues={{
        password: '',
        confirmPassword: '',
      }}
      validationSchema={stepThreeValidationSchema}
      validateOnChange={false}
      validateOnBlur={false}
      validateOnMount={false}
      onSubmit={(values) => {
        toast.success('Adım 3 başarıyla tamamlandı!');
        navigate('/');
      }}
    >
      {({ errors, validateForm, handleSubmit }) => {
        const customSubmit = async (e) => {
          e.preventDefault();
          const validationErrors = await validateForm();
          if (Object.keys(validationErrors).length > 0) {
            Object.values(validationErrors).forEach((errorMsg) => {
              toast.error(errorMsg);
            });
          } else {
            handleSubmit();
          }
        };

        return (
          <Form onSubmit={customSubmit}>
            <div className="mb-4">
              <label htmlFor="password" className="block mb-2">
                Şifre
              </label>
              <Field
                id="password"
                name="password"
                type="password"
                className="border p-2 rounded w-full"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block mb-2">
                Şifre Doğrulama
              </label>
              <Field
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                className="border p-2 rounded w-full"
              />
            </div>

            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Kaydı Tamamla
            </button>
          </Form>
        );
      }}
    </Formik>
  );
};

export default StepThree;
