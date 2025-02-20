const mongoose = require('mongoose');
const Category = require('../models/category');
const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });

const categorySeeder = async (req, res) => {
  const categories = [
    {
      name: 'Özel Ders',
      subcategories: ['Spor', 'Ders', 'Müzik', 'Danışmanlık', 'Diğer'],
    },
    {
      name: 'Spor',
      subcategories: [
        'Bisiklet',
        'Fitness & Kondisyon',
        'Vücut Geliştirme',
        'Pilates, Yoga & Jimnastik',
        'Takım Sporları',
        'Atletizm',
        'Doğa Sporları',
        'Dövüş Sporları',
        'Raket Sporları',
        'Salon Oyunları',
        'Sıra Dışı Sporlar',
        'Su Sporları',
        'Diğer',
      ],
    },
    {
      name: 'Bakım Onarım',
      subcategories: [
        'Araç',
        'Elektronik aletler',
        'Elektronik olmayan aletler',
        'Ev elektroniği',
        'Ev bakım onarım',
        'Diğer',
      ],
    },
    {
      name: 'Tadilat',
      subcategories: [
        'Ev içi tadilatı',
        'Ev dışı tadilatı',
        'İş yeri tadilatı',
        'Boya-badana',
        'Su tesisatı',
        'Elektrik tesisatı',
        'Diğer',
      ],
    },
    {
      name: 'Temizlik',
      subcategories: [
        'Ev içi eşya temizliği',
        'Ev temizliği',
        'Kuru temizleme',
        'Halı ve Koltuk Temizliği',
        'İnşaat sonrası temizlik',
        'Ofis temizliği',
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
        'Mobilya üretimi',
        'Gıda üretimi',
        'Kimyasal üretim',
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
        'Lojistik & Nakliye',
        'Kargo & Kurye',
        'Diğer',
      ],
    },
    {
      name: 'Güzellik',
      subcategories: [
        'Kuaför',
        'Berber',
        'Güzellik merkezi',
        'Nail artist',
        'Dövme sanatçıları – piercing',
        'Epilasyon',
        'Cilt bakımı',
        'Spa & Masaj',
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
        'Özel şoförler',
        'Yaşlı bakım hizmetleri',
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
        'Mezuniyet',
        'Kurumsal Etkinlikler',
        'Açılış organizasyonu',
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
