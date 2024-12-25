import InputField from "../UI/inputField";
import { memo } from "react";


const StepOne = () => {
  return (
    <>
      <InputField label="Adınız" name="name" placeholder="Adınızı girin" />
      <InputField
        label="Soyadınız"
        name="lastname"
        placeholder="Soyadınızı girin"
      />
      <InputField
        label="Telefon"
        name="phone"
        placeholder="Telefon numaranızı girin"
      />
      <InputField
        label="E-posta"
        name="email"
        placeholder="E-posta adresinizi girin"
      />
    </>
  );
};

export default memo(StepOne);
