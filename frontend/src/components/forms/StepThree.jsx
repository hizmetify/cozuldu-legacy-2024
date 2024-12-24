import InputField from '../UI/inputField';

const StepThree = () => (
  <>
    <InputField
      label="Şifre"
      name="password"
      type="password"
      placeholder="Şifrenizi girin"
    />
    <InputField
      label="Şifre Tekrar"
      name="confirmPassword"
      type="password"
      placeholder="Şifrenizi tekrar girin"
    />
  </>
);

export default StepThree;
