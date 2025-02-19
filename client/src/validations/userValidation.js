import * as Yup from 'yup';

export const stepOneValidationSchema = Yup.object({
  name: Yup.string()
    .required('İsim zorunludur')
    .min(2, 'İsim en az iki karakter olmalıdır')
    .max(50, 'İsim en fazla 50 karakter olabilir'),

  lastname: Yup.string()
    .required('Soyisim zorunludur.')
    .min(2, 'Soyisim en az iki karakter olmalıdır.')
    .max(50, 'Soyisim en fazla 50 karakter olabilir.'),

  email: Yup.string()
    .required('E-posta zorunludur.')
    .email('Geçerli bir e-posta adresi girin'),
});

  export const stepTwoValidationSchema = Yup.object({
    phone: Yup.string()
      .matches(/^\d{10,15}$/, 'Telefon numarası sadece rakamlardan oluşmalı ve 10-15 hane arasında olmalıdır')
      .notRequired(),
    city: Yup.string().nullable().required('Şehir alanı zorunludur'), // Güncellendi
    profilePic: Yup.string().url('Profil resmi için geçerli bir URL girin').notRequired(),
    portfolioLink: Yup.string().url('Portfolio linki geçerli bir URL olmalıdır').notRequired(),
  });


export const stepThreeValidationSchema = Yup.object({
  password: Yup.string()
    .required('Şifre zorunludur.')
    .min(8, 'Şifre en az 8 karakter olmalıdır.'),

  confirmPassword: Yup.string()
    .required('Şifrenizi doğrulama zorunludur.')
    .oneOf([Yup.ref('password'), null], 'Şifreler eşleşmiyor'),
});

export const loginValidation = Yup.object({
  email: Yup.string()
    .email('Hatalı ya da eksik bilgi girdiniz.')
    .required('Hatalı ya da eksik bilgi girdiniz.'),
  password: Yup.string()
    .min(8, 'Hatalı ya da eksik bilgi girdiniz.')
    .required('Hatalı ya da eksik bilgi girdiniz.'),
});
