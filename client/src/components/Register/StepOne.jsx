import { memo, useEffect, useCallback } from 'react';
import { Formik, Form } from 'formik';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { showToast } from '../../features/toast/toastSlice';
import { updateRegisterData } from '../../features/register/registerSlice';
import { stepOneValidationSchema } from '../../validations/userValidation';
import InputField from '../UI/InputField';
import { FaUserAlt, FaIdCardAlt, FaInfoCircle } from 'react-icons/fa';

const createInitialValues = (name, lastname) => ({
  name: name || '',
  lastname: lastname || '',
});

const StepOne = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { setIsSubmitting } = useOutletContext() || {};
  const { name, lastname } = useSelector((state) => state.register.data);

  useEffect(() => {
    if (setIsSubmitting) {
      setIsSubmitting(false);
    }

    return () => {
      if (setIsSubmitting) {
        setIsSubmitting(false);
      }
    };
  }, [setIsSubmitting]);

  const handleFormSubmit = useCallback(
    (values, { setSubmitting }) => {
      dispatch(updateRegisterData(values));
      dispatch(
        showToast({
          message: 'Adım 1 başarıyla tamamlandı!',
          type: 'success',
        })
      );
      setSubmitting(false);
      if (setIsSubmitting) {
        setIsSubmitting(false);
      }
      navigate('/register/step-2');
    },
    [dispatch, navigate, setIsSubmitting]
  );

  const customSubmit = useCallback(
    async (e, { validateForm, handleSubmit, setErrors }) => {
      if (e) e.preventDefault();
      const validationErrors = await validateForm();

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);

        const firstError = Object.values(validationErrors)[0];
        dispatch(showToast({ message: firstError, type: 'error' }));

        if (setIsSubmitting) {
          setIsSubmitting(false);
        }
      } else {
        await handleSubmit();
      }
    },
    [dispatch, setIsSubmitting]
  );

  const initialValues = createInitialValues(name, lastname);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={stepOneValidationSchema}
      validateOnChange={true}
      validateOnBlur={true}
      onSubmit={handleFormSubmit}
      enableReinitialize={false}
    >
      {({ validateForm, handleSubmit, setErrors, errors, touched }) => (
        <Form
          id="stepForm-0"
          onSubmit={(e) =>
            customSubmit(e, { validateForm, handleSubmit, setErrors })
          }
          className="flex flex-col h-full"
        >
          <div className="flex flex-col gap-6 flex-grow">
            <InputField
              name="name"
              label="İsim"
              placeholder="Adınızı girin"
              error={errors.name && touched.name ? errors.name : null}
              icon={FaUserAlt}
            />
            <InputField
              name="lastname"
              label="Soyisim"
              placeholder="Soyadınızı girin"
              error={
                errors.lastname && touched.lastname ? errors.lastname : null
              }
              icon={FaIdCardAlt}
            />

            <div className="text-sm text-gray-500 mt-4 flex items-start">
              <FaInfoCircle className="text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
              <p>Tüm alanlar zorunludur</p>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default memo(StepOne);
