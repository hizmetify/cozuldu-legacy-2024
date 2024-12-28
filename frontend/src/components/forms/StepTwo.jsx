import InputField from '../UI/inputField';
import SelectField from '../UI/SelectField';
import { fetchCities } from '../../api/cityApi';
import { useEffect, useState } from 'react';
import { memo } from 'react';

const StepTwo = () => {
  const [cities, setCities] = useState([]);

  useEffect(() => {
    const loadCities = async () => {
      const cityData = await fetchCities();
      setCities(cityData);
    };
    loadCities();
  }, []);

  return (
    <div className='flex flex-col gap-2'>
      <SelectField label="Şehir" name="city" options={cities} />
      <InputField
        label="Profil Fotoğrafı URL"
        name="profilePic"
        placeholder="Profil fotoğrafı linki"
      />
      <InputField
        label="Portfolio Linki"
        name="portfolioLink"
        placeholder="Portfolio linkinizi girin"
      />
    </div>
  );
};

export default memo(StepTwo);
