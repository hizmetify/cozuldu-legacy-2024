import * as Yup from 'yup';

const serviceTypeOptions = ['yüz yüze'];
const priceTypeOptions = ['saatlik', 'günlük', 'iş başı'];

export const AdSchema = Yup.object().shape({
  title: Yup.string()
    .min(5, 'En az 5 karakter')
    .max(100, 'En fazla 100 karakter')
    .required('Başlık zorunludur'),

  description: Yup.string()
    .min(20, 'En az 20 karakter')
    .max(1000, 'En fazla 1000 karakter')
    .required('Açıklama zorunludur'),

  serviceType: Yup.string()
    .oneOf(serviceTypeOptions, 'Hizmet tipi yalnızca yüz yüze olabilir')
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
      priceTypeOptions,
      'Geçerli bir fiyat türü seçin (saatlik, günlük, iş başı)'
    )
    .required('Fiyat tipi zorunludur'),

  availability: Yup.array().of(
    Yup.date().typeError('Geçerli bir tarih giriniz')
  ),
});
