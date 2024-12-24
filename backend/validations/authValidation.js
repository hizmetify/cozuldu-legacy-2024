const Joi = require('joi');
  
const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    'string.empty': 'İsim gerekli',
    'string.min': 'İsim en az 2 karakter olmalı',
    'string.max': 'İsim 50 karakterden az olmalı',
  }),
  lastname: Joi.string().min(2).max(50).required().messages({
    'string.empty': 'Soyisim gerekli',
    'string.min': 'Soyisim en az 2 karakter olmalı',
    'string.max': 'Soyisim 50 karakterden az olmalı',
  }),
  email: Joi.string().email().required().messages({
    'string.empty': 'E-posta gerekli',
    'string.email': 'Lütfen geçerli bir e-posta adresi girin',
  }),
  password: Joi.string().min(8).required().messages({
    'string.empty': 'Şifre gerekli',
    'string.min': 'Şifre en az 8 karakter olmalı',
  }),
  phone: Joi.string()
    .pattern(/^\d{10,15}$/)
    .allow("") // Boş stringe izin verildi
    .messages({
      'string.pattern.base': 'Telefon numarası 10 ile 15 rakam arasında olmalı',
    })
    .optional(), // Opsiyonel yapıldı
  city: Joi.string().required().messages({
    'string.empty': 'Şehir gerekli',
  }),
  profilePic: Joi.string()
    .uri()
    .allow("") // Boş stringe izin verildi
    .messages({
      'string.empty': 'Profil resmi URL’si gerekli',
      'string.uri': 'Profil resmi geçerli bir URL olmalı',
    })
    .optional(), // Opsiyonel yapıldı
  portfolioLink: Joi.string()
    .uri()
    .allow("") // Boş stringe izin verildi
    .messages({
      'string.empty': 'Portföy bağlantısı gerekli',
      'string.uri': 'Portföy bağlantısı geçerli bir URL olmalı',
    })
    .optional(), // Opsiyonel yapıldı
});



const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.empty': 'E-posta gerekli',
    'string.email': 'Lütfen geçerli bir e-posta adresi girin',
  }),
  password: Joi.string().min(8).required().messages({
    'string.empty': 'Şifre gerekli',
    'string.min': 'Şifre en az 8 karakter olmalı',
  }),
});

module.exports = {
  registerSchema,
  loginSchema,
};
