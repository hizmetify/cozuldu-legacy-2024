const mongoose = require('mongoose');
const Category = require('../models/category');
const SubCategory = require('../models/subCategory');
const dotenv = require('dotenv');

dotenv.config({ path: '../.env' });

const categorySeeder = async () => {
  const categories = [
    {
      name: 'Temizlik',
      subcategories: [
        'Ev Temizliği',
        'Koltuk Yıkama',
        'Halı Yıkama',
        'İnşaat Sonrası Temizlik',
        'Ofis Temizliği',
        'Dış Cephe Temizliği',
        'Cam Temizliği',
        'Fabrika Temizliği',
        'Organize Ev Temizliği',
        'Yazlık/Kışlık Ev Temizliği',
      ],
    },
    {
      name: 'Tadilat',
      subcategories: [
        'Boya Badana',
        'Asma Tavan Yapımı',
        'Alçıpan Uygulaması',
        'Parke Döşeme',
        'Seramik/Fayans Döşeme',
        'Mutfak ve Banyo Tadilatı',
        'İç Mekan Tasarımı',
        'Dış Cephe Mantolama',
        'Çatı Tadilatı',
        'Deprem Tadilatı',
      ],
    },
    {
      name: 'Nakliyat',
      subcategories: [
        'Evden Eve Nakliyat',
        'Şehirler Arası Nakliyat',
        'Parça Eşya Taşıma',
        'Ofis Taşıma',
        'Eşya Depolama',
        'Küçük Ev Eşyası Taşıma',
        'Yük Taşıma',
        'Kargo ve Lojistik Hizmetleri',
        'Fuar Taşıma',
        'Eve Özel Taşıma',
      ],
    },
    {
      name: 'Tamir',
      subcategories: [
        'Elektrikçi',
        'Tesisatçı',
        'Beyaz Eşya Tamiri',
        'Kombi ve Doğalgaz Hizmetleri',
        'Klima Servisi',
        'Çilingir',
        'Sıhhi Tesisat',
        'Su Tesisatı',
        'Isı Pompası Servisi',
        'Ağaç ve Bahçe Bakımı',
      ],
    },
    {
      name: 'Sağlık',
      subcategories: [
        'Online Psikolog',
        'Fizyoterapi',
        'Diyetisyen',
        'Ağız ve Diş Sağlığı',
        'Göz Muayenesi',
        'Kişisel Antrenör',
        'Saç Ekimi',
        'Cilt Bakımı',
        'Sağlık Danışmanlığı',
        'Medikal Estetik',
      ],
    },
    {
      name: 'Organizasyon',
      subcategories: [
        'Düğün Organizasyonu',
        'Nişan ve Söz Organizasyonu',
        'Doğum Günü Organizasyonu',
        'Kurumsal Etkinlikler',
        'Kokteyl ve Davet Organizasyonu',
        'Konser ve Festival Organizasyonu',
        'Sünnet Düğünü Organizasyonu',
        'Baby Shower Organizasyonu',
        'Açılış ve Lansman Organizasyonu',
        'Spor Etkinlikleri Organizasyonu',
      ],
    },
    {
      name: 'Diğer',
      subcategories: [
        'Fotoğraf & Video',
        'Dış Çekim',
        'Günü Fotoğrafçısı',
        'Düğün Fotoğrafçısı',
        'Drone Çekimi',
        'Video Çekimi',
        'Evcil Hayvanlar',
        'Evde Kedi Bakımı',
        'Kedi Kuaförü',
        'Köpek Eğitimi',
      ],
    },
    {
      name: 'Özel Ders',
      subcategories: [
        'Matematik Özel Ders',
        'İngilizce Özel Ders',
        'Fizik Özel Ders',
        'Kimya Özel Ders',
        'Biyoloji Özel Ders',
        'Türkçe Özel Ders',
        'Lise ve Üniversite Hazırlık',
        'Yabancı Dil Kursları',
        'Müzik Dersleri',
        'Sanat ve Tasarım Dersleri',
      ],
    },
    {
      name: 'Spor Branşları (Özel Ders)',
      subcategories: [
        'Futbol',
        'Basketbol',
        'Voleybol',
        'Tenis',
        'Yüzme',
        'Jimnastik',
        'Boks',
        'Kickboks',
        'Judo',
        'Taekwondo',
        'Masa Tenisi',
        'Rugby',
        'Amerikan Futbolu',
        'Badminton',
        'Güreş',
        'Atletizm',
        'Skeletik Sporlar',
        'Kürek',
        'Okçuluk',
        'Dalgıçlık',
        'Fencing (Kılıç Kavgaları)',
        'Fitness',
        'Yoga',
        'Pilates',
        'Salsa ve Dans Dersleri',
        'Buz Pateni',
      ],
    },
  ];

  try {
    await mongoose.connect(process.env.MONGO_URI);

    await Category.deleteMany();
    await SubCategory.deleteMany();

    for (const cat of categories) {
      const newCategory = await Category.create({ name: cat.name });
      for (const subCatName of cat.subcategories) {
        await SubCategory.create({
          name: subCatName,
          category: newCategory._id,
        });
      }
    }

    console.log('Kategori ve alt kategoriler başarıyla eklendi!');
  } catch (error) {
    console.error('Hata:', error);
  } finally {
    mongoose.disconnect();
  }
};

categorySeeder();
