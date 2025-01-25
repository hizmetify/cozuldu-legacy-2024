import { Formik, Form, Field } from 'formik';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { stepOneValidationSchema } from '../../validations/userValidation';
import { useDispatch, useSelector } from 'react-redux';
import { updateRegisterData } from '../../features/register/registerSlice';

const StepOne = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { name, lastname, email } = useSelector((state) => state.register.data);

  return (
    <Formik
      initialValues={{ name, lastname, email }}
      validationSchema={stepOneValidationSchema}
      validateOnChange={false}
      validateOnBlur={false}
      onSubmit={(values) => {
        dispatch(updateRegisterData(values));
        toast.success('Adım 1 başarıyla tamamlandı!');
        navigate('/register/step-2');
      }}
    >
      {({ errors, validateForm, handleSubmit }) => {
        const customSubmit = async (e) => {
          e.preventDefault();
          const validationErrors = await validateForm();

          if (Object.keys(validationErrors).length > 0) {
            Object.values(validationErrors).forEach((errorMsg) =>
              toast.error(errorMsg)
            );
          } else {
            handleSubmit();
          }
        };

        return (
          <Form onSubmit={customSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block mb-2">
                İsim
              </label>
              <Field
                id="name"
                name="name"
                type="text"
                className="border p-2 rounded w-full"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="lastname" className="block mb-2">
                Soyisim
              </label>
              <Field
                id="lastname"
                name="lastname"
                type="text"
                className="border p-2 rounded w-full"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block mb-2">
                E-posta
              </label>
              <Field
                id="email"
                name="email"
                type="email"
                className="border p-2 rounded w-full"
              />
            </div>

            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Devam Et
            </button>
          </Form>
        );
      }}
    </Formik>
  );
};

export default StepOne;
