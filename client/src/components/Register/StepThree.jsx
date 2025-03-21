import { memo, useState, useEffect, useCallback } from 'react';
import { Formik, Form } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useOutletContext } from 'react-router-dom';
import {
  FaEye,
  FaEyeSlash,
  FaLock,
  FaShieldAlt,
  FaInfoCircle,
  FaCheck,
} from 'react-icons/fa';

import { updateRegisterData } from '../../features/register/registerSlice';
import { register } from '../../features/auth/authSlice';
import { showToast } from '../../features/toast/toastSlice';
import { stepThreeValidationSchema } from '../../validations/userValidation';

import InputField from '../UI/InputField';

const PasswordStrengthIndicator = ({ password }) => {
  const getStrength = (pass) => {
    if (!pass) return 0;
    let strength = 0;

    if (pass.length >= 8) strength += 1;

    if (/[A-Z]/.test(pass)) strength += 1;
    if (/[0-9]/.test(pass)) strength += 1;
    if (/[^A-Za-z0-9]/.test(pass)) strength += 1;

    return Math.min(strength, 4);
  };

  const strength = getStrength(password);
  const percentage = (strength / 4) * 100;
  const getColor = () => {
    if (strength <= 1) return 'bg-red-400';
    if (strength <= 2) return 'bg-yellow-400';
    return 'bg-green-400';
  };

  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const hasMinLength = password.length >= 8;

  return (
    <div className="mt-2 mb-4">
      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-3">
        <div
          className={`h-full ${getColor()} transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-500">
        <div className={hasUppercase ? 'text-green-600' : ''}>
          {hasUppercase && <FaCheck className="inline mr-1" size={12} />}
          Büyük harf
        </div>
        <div className={hasNumber ? 'text-green-600' : ''}>
          {hasNumber && <FaCheck className="inline mr-1" size={12} />}
          Rakam
        </div>
        <div className={hasSpecial ? 'text-green-600' : ''}>
          {hasSpecial && <FaCheck className="inline mr-1" size={12} />}
          Özel karakter
        </div>
        <div className={hasMinLength ? 'text-green-600' : ''}>
          {hasMinLength && <FaCheck className="inline mr-1" size={12} />}
          En az 8 karakter
        </div>
      </div>
    </div>
  );
};

const StepThree = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { setIsSubmitting } = useOutletContext() || {};
  const registerData = useSelector((state) => state.register.data);

  const { password, confirmPassword } = registerData;
  const initialValues = {
    password: password || '',
    confirmPassword: confirmPassword || '',
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');

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
    async (values, { setSubmitting }) => {
      try {
        dispatch(updateRegisterData(values));
        const finalData = { ...registerData, ...values };

        await dispatch(register(finalData)).unwrap();
        dispatch(showToast({ message: 'Kayıt başarılı!', type: 'success' }));
        navigate('/dashboard');
      } catch (error) {
        dispatch(showToast({ message: error, type: 'error' }));
      } finally {
        setSubmitting(false);
        if (setIsSubmitting) {
          setIsSubmitting(false);
        }
      }
    },
    [dispatch, navigate, registerData, setIsSubmitting]
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

  const handlePasswordChange = useCallback((e) => {
    setCurrentPassword(e.target.value);
  }, []);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={stepThreeValidationSchema}
      validateOnChange={true}
      validateOnBlur={true}
      onSubmit={handleFormSubmit}
      enableReinitialize={false}
    >
      {({
        validateForm,
        handleSubmit,
        setErrors,
        errors,
        touched,
        handleChange,
      }) => {
        const customHandlePasswordChange = (e) => {
          handleChange(e);
          handlePasswordChange(e);
        };

        return (
          <Form
            id="stepForm-2"
            onSubmit={(e) =>
              customSubmit(e, { validateForm, handleSubmit, setErrors })
            }
            className="flex flex-col h-full"
          >
            <div className="flex flex-col gap-5 flex-grow">
              <div className="text-sm text-blue-700 flex items-start">
                <FaShieldAlt className="text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                <p>
                  Güçlü bir şifre oluşturun. En az 8 karakter, büyük harf, rakam
                  ve özel karakter içermelidir.
                </p>
              </div>

              <div className="relative">
                <InputField
                  name="password"
                  label="Şifre"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Şifrenizi girin"
                  error={
                    errors.password && touched.password ? errors.password : null
                  }
                  icon={FaLock}
                  onChange={customHandlePasswordChange}
                />
                <button
                  type="button"
                  className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Şifreyi gizle' : 'Şifreyi göster'}
                >
                  {showPassword ? (
                    <FaEyeSlash size={16} />
                  ) : (
                    <FaEye size={16} />
                  )}
                </button>
              </div>

              <PasswordStrengthIndicator password={currentPassword} />

              <div className="relative">
                <InputField
                  name="confirmPassword"
                  label="Şifre (Tekrar)"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Şifrenizi tekrar girin"
                  error={
                    errors.confirmPassword && touched.confirmPassword
                      ? errors.confirmPassword
                      : null
                  }
                  icon={FaLock}
                />
                <button
                  type="button"
                  className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={
                    showConfirmPassword ? 'Şifreyi gizle' : 'Şifreyi göster'
                  }
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash size={16} />
                  ) : (
                    <FaEye size={16} />
                  )}
                </button>
              </div>

              <div className="text-xs text-gray-500 mt-2 flex items-start">
                <FaInfoCircle className="text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                <p>Tüm alanlar zorunludur</p>
              </div>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default memo(StepThree);
