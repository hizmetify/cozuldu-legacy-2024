import InputField from "../UI/inputField";
import { memo } from "react";


const StepOne = () => {
  return (
    <div className="flex flex-col gap-2">
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
    </div>
  );
};

export default memo(StepOne);
