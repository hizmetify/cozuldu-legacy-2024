const mongoose = require('mongoose');
const Category = require('../models/category');
const dotenv = require('dotenv');
dotenv.config({path: "../.env"});


const categorySeeder = async (req, res) => {
  const categories = [
    {
      name: 'ÖZEL DERS',
      subcategories: ['Spor', 'Ders', 'Müzik', 'Danışmanlık', 'Diğer'],
    },
    {
      name: 'BAKIM ONARIM',
      subcategories: [
        'Araç',
        'Elektronik aletler',
        'Elektronik olmayan aletler',
        'Ev elektroniği',
        'Ev bakım onarım',
        'Diğer ',
      ],
    },
    {
      name: 'TADİLAT',
      subcategories: ['Ev içi tadilatı', 'Ev dışı tadilatı', 'Diğer'],
    },
    {
      name: 'TEMİZLİK',
      subcategories: [
        'Ev içi eşya temizliği',
        'Ev temizliği',
        'Kuru temizleme',
        'Diğer',
      ],
    },
    {
      name: 'ÜRETİM',
      subcategories: [
        'Catering',
        'Tekstilciler',
        'Toptancılar',
        'Ham maddeler',
        'Diğer',
      ],
    },
    {
      name: 'ULAŞIM',
      subcategories: [
        'Şehir içi',
        'Yurt dışı',
        'Yurt içi',
        'Transfer hizmetleri',
        'Diğer',
      ],
    },
    {
      name: 'GÜZELLİK',
      subcategories: [
        'Kuaför',
        'Berber',
        'Güzellik merkezi',
        'Nail artist ',
        'Dövme sanatçıları – piercing',
        'Epilasyon',
        'Diğer',
      ],
    },
    {
      name: 'YARDIMCILAR',
      subcategories: [
        'Hasta bakıcılar',
        'Çocuk bakıcılar',
        'Ev içi yardımcılar',
        'Güvenlik görevlileri',
        'Diğer',
      ],
    },
    {
      name: 'ORGANİZASYONLAR',
      subcategories: [
        'Doğum günü',
        'Kına',
        'Düğün',
        'Sünnet',
        'Baby Shower',
        'Diğer',
      ],
    },
  ];

  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Category.deleteMany();
    await Category.insertMany(categories);
  } catch (error) {
    console.error(error);
  } finally {
    mongoose.disconnect();
  }
};

categorySeeder();
