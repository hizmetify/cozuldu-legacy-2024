const mongoose = require('mongoose');
const Category = require('../models/category');
const dotenv = require('dotenv');
dotenv.config({path: "../.env"});


const categorySeeder = async (req, res) => {
  const categories = [
    {
      name: 'Özel Ders',
      subcategories: ['Spor', 'Ders', 'Müzik', 'Danışmanlık', 'Diğer'],
    },
    {
      name: 'Bakım Onarım',
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
      name: 'Tadilat',
      subcategories: ['Ev içi tadilatı', 'Ev dışı tadilatı', 'Diğer'],
    },
    {
      name: 'Temizlik',
      subcategories: [
        'Ev içi eşya temizliği',
        'Ev temizliği',
        'Kuru temizleme',
        'Diğer',
      ],
    },
    {
      name: 'Üretim',
      subcategories: [
        'Catering',
        'Tekstilciler',
        'Toptancılar',
        'Ham maddeler',
        'Diğer',
      ],
    },
    {
      name: 'Ulaşım',
      subcategories: [
        'Şehir içi',
        'Yurt dışı',
        'Yurt içi',
        'Transfer hizmetleri',
        'Diğer',
      ],
    },
    {
      name: 'Güzellik',
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
      name: 'Yardımcılar',
      subcategories: [
        'Hasta bakıcılar',
        'Çocuk bakıcılar',
        'Ev içi yardımcılar',
        'Güvenlik görevlileri',
        'Diğer',
      ],
    },
    {
      name: 'Organizasyonlar',
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
