const Joi = require('joi');

const adValidationSchema = Joi.object({
  title: Joi.string().min(5).max(100).required().messages({
    'string.empty': 'İlan başlığı boş olamaz',
    'string.min': 'İlan başlığı en az 5 karakter olmalıdır',
    'string.max': 'İlan başlığı en fazla 100 karakter olabilir',
  }),

  description: Joi.string().min(20).max(1000).required().messages({
    'string.empty': 'Açıklama boş olamaz',
    'string.min': 'Açıklama en az 20 karakter olmalıdır',
    'string.max': 'Açıklama en fazla 1000 karakter olabilir',
  }),

  serviceType: Joi.string().valid('yüz yüze', 'dijital').required().messages({
    'any.only': 'Hizmet türü "yüz yüze" veya "dijital" olmalıdır',
  }),

  city: Joi.string().when('serviceType', {
    is: 'yüz yüze',
    then: Joi.required().messages({
      'string.empty': 'Şehir seçimi yüz yüze hizmet için gereklidir',
    }),
    otherwise: Joi.forbidden(),
  }),

  price: Joi.number().greater(0).required().messages({
    'number.base': 'Fiyat geçerli bir sayı olmalıdır',
    'number.greater': 'Fiyat sıfırdan büyük olmalıdır',
  }),

  priceType: Joi.string()
    .valid('saatlik', 'günlük', 'iş başı')
    .required()
    .messages({
      'any.only': 'Geçerli bir fiyat türü seçin (saatlik, günlük, iş başı)',
    }),

  availability: Joi.array().items(Joi.date()).optional().messages({
    'array.base': 'Uygunluk tarihleri geçerli bir tarih dizisi olmalıdır',
  }),

  user: Joi.string().required().messages({
    'string.empty': 'Kullanıcı kimliği gerekli',
  }),

  images: Joi.array().items(Joi.string().uri()).optional().messages({
    'array.base': "Resim URL'leri geçerli bir dizi olmalıdır",
  }),
});

module.exports = adValidationSchema;
