const Joi = require('joi');

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

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

  serviceType: Joi.string().valid('yüz yüze').required().messages({
    'any.only': 'Hizmet tipi yalnızca "yüz yüze" olabilir',
  }),

  city: Joi.string().min(2).max(100).required().messages({
    'string.empty': 'Şehir boş olamaz',
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

  category: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.empty': 'Kategori seçilmelidir',
      'string.pattern.base': 'Geçersiz kategori ID',
    }),

  subCategory: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.empty': 'Alt kategori seçilmelidir',
      'string.pattern.base': 'Geçersiz alt kategori ID',
    }),

  images: Joi.array().items(Joi.string()).optional().messages({
    'array.base': 'Resimler geçerli bir dizi olmalıdır',
  }),
  imagesToDelete: Joi.array().items(Joi.string()).optional(),
});

module.exports = adValidationSchema;
