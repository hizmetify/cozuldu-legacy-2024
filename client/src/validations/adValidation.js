import * as Yup from 'yup';

const serviceTypeValidationOptions = ['yüz yüze'];
const priceTypeValidationOptions = ['saatlik', 'günlük', 'iş başı'];
const objectIdRegex = /^[0-9a-fA-F]{24}$/;
export const step1Schema = Yup.object().shape({
  title: Yup.string()
    .min(5, 'En az 5 karakter')
    .max(100, 'En fazla 100 karakter')
    .required('Başlık zorunludur'),
  description: Yup.string()
    .min(20, 'En az 20 karakter')
    .max(1000, 'En fazla 1000 karakter')
    .required('Açıklama zorunludur'),
}); 

export const step2Schema = Yup.object().shape({
  serviceType: Yup.string()
    .oneOf(
      serviceTypeValidationOptions,
      'Hizmet tipi yalnızca yüz yüze olabilir'
    )
    .required('Hizmet tipi zorunludur'),
  city: Yup.string()
    .min(2, 'Şehir en az 2 karakter olmalıdır')
    .required('Şehir zorunludur'),
  price: Yup.number()
    .typeError('Fiyat bir sayı olmalıdır')
    .moreThan(0, 'Fiyat sıfırdan büyük olmalıdır')
    .required('Fiyat zorunludur'),
  priceType: Yup.string()
    .oneOf(
      priceTypeValidationOptions,
      'Geçerli bir fiyat türü seçin (saatlik, günlük, iş başı)'
    )
    .required('Fiyat tipi zorunludur'),
  category: Yup.string()
    .matches(objectIdRegex, 'Geçersiz kategori ID')
    .required('Kategori zorunludur'),
  subCategory: Yup.string()
    .matches(objectIdRegex, 'Geçersiz alt kategori ID')
    .required('Alt kategori zorunludur'),
});

export const fullAdSchema = Yup.object().shape({
  title: step1Schema.fields.title,
  description: step1Schema.fields.description,
  serviceType: step2Schema.fields.serviceType,
  city: step2Schema.fields.city,
  price: step2Schema.fields.price,
  priceType: step2Schema.fields.priceType,
  category: step2Schema.fields.category,
  subCategory: step2Schema.fields.subCategory,
});
