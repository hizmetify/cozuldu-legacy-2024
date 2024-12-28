import { memo } from 'react';
import InputField from '../UI/inputField';

const StepThree = () => (
  <div className='flex flex-col gap-2'>
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
  </div>
);

export default memo(StepThree);
