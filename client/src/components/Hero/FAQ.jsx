import { useState } from 'react';
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdQuestionAnswer,
} from 'react-icons/md';
import { Link } from 'react-router-dom';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: 'Çözüldü platformu nasıl çalışır?',
      answer:
        'Çözüldü, hizmet arayanlar ile hizmet verenleri buluşturan bir platformdur. İhtiyacınız olan hizmeti seçip talebinizi oluşturduktan sonra, onaylı hizmet verenlerden teklifler alırsınız. Size en uygun teklifi seçerek hizmet alabilirsiniz.',
    },
    {
      question: 'Hizmet veren olarak nasıl kaydolabilirim?',
      answer:
        'Hizmet veren olarak kaydolmak için "Hizmet Ver" butonuna tıklayarak kayıt formunu doldurabilirsiniz. Gerekli bilgilerinizi ve belgelerinizi sisteme yükledikten sonra onay sürecine alınacaksınız. Onay sürecinin ardından platformda hizmet vermeye başlayabilirsiniz.',
    },
    {
      question: 'Hizmet kalitesi nasıl garanti ediliyor?',
      answer:
        'Platformumuzda yer alan tüm hizmet verenler detaylı bir onay sürecinden geçmektedir. Ayrıca, her hizmet sonrası müşteriler tarafından yapılan değerlendirmeler ve puanlamalar sayesinde hizmet kalitesi sürekli olarak denetlenmektedir. Herhangi bir sorun yaşanması durumunda müşteri hizmetlerimiz devreye girerek çözüm sunmaktadır.',
    },
    {
      question: 'Platformda hangi hizmet kategorileri bulunuyor?',
      answer:
        'Platformumuzda temizlik, tadilat, nakliyat, özel ders, bakım, taşıma, montaj gibi birçok kategoride hizmet sunulmaktadır. Ana sayfamızdan tüm kategorileri görüntüleyebilir veya arama çubuğunu kullanarak ihtiyacınız olan spesifik hizmeti bulabilirsiniz.',
    },
  ];

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Sıkça Sorulan <span className="text-blue-600">Sorular</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Platformumuz hakkında merak ettiğiniz soruların cevaplarını burada
            bulabilirsiniz.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border-b border-gray-100 last:border-b-0"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full text-left px-6 py-4 focus:outline-none"
                >
                  <div className="flex items-center justify-between">
                    <h3
                      className={`text-lg font-medium ${
                        openIndex === index ? 'text-blue-600' : 'text-gray-800'
                      }`}
                    >
                      {faq.question}
                    </h3>
                    <div
                      className={`ml-4 transition-transform duration-300 ${
                        openIndex === index ? 'transform rotate-180' : ''
                      }`}
                    >
                      {openIndex === index ? (
                        <MdKeyboardArrowUp className="text-blue-600 text-2xl" />
                      ) : (
                        <MdKeyboardArrowDown className="text-gray-400 text-2xl" />
                      )}
                    </div>
                  </div>
                </button>
                <div
                  className={`transition-all duration-300 overflow-hidden ${
                    openIndex === index
                      ? 'max-h-96 opacity-100'
                      : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-6 pb-4 text-gray-600">{faq.answer}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
