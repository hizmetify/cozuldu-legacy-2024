import * as Yup from 'yup';

const serviceTypeOptions = ['yüz yüze'];
const priceTypeOptions = ['saatlik', 'günlük', 'iş başı'];

export const AdSchema = Yup.object().shape({
  title: Yup.string().required('Başlık zorunludur'),
  description: Yup.string().required('Açıklama zorunludur'),
  serviceType: Yup.string()
    .oneOf(serviceTypeOptions)
    .required('Hizmet tipi zorunludur'),
  city: Yup.string().when('serviceType', (serviceType, schema) => {
    if (serviceType === 'yüz yüze') {
      return schema.required('Şehir zorunlu.');
    }
    return schema.notRequired();
  }),

  price: Yup.number()
    .typeError('Fiyat sayı olmalıdır')
    .required('Fiyat Zorunludur.'),
  priceType: Yup.string()
    .oneOf(priceTypeOptions)
    .required('Fiyat tipi zorunludur'),
  availability: Yup.array().of(
    Yup.date()
      .typeError('Geçerli bir tarih giriniz')
      .required('Tarih zorunludur')
  ),
  images: Yup.array().of(Yup.string().url('Geçerli bir URL girin.')),
});
