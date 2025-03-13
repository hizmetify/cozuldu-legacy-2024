import { useState, useRef } from 'react';
import {
  MdPhone,
  MdEmail,
  MdLocationOn,
  MdAccessTime,
  MdSend,
  MdCheck,
  MdInfo,
  MdFacebook,
  MdWhatsapp,
} from 'react-icons/md';
import { FaInstagram, FaTwitter, FaLinkedinIn } from 'react-icons/fa';

const ContactUs = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [formStatus, setFormStatus] = useState({
    isSubmitting: false,
    isSubmitted: false,
    isError: false,
    message: '',
  });

  const formRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formState.name || !formState.email || !formState.message) {
      setFormStatus({
        isSubmitting: false,
        isSubmitted: false,
        isError: true,
        message: 'Lütfen gerekli alanları doldurun.',
      });
      return;
    }

    setFormStatus({
      isSubmitting: true,
      isSubmitted: false,
      isError: false,
      message: '',
    });

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setFormStatus({
        isSubmitting: false,
        isSubmitted: true,
        isError: false,
        message:
          'Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.',
      });

      setFormState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });

      setTimeout(() => {
        setFormStatus((prev) => ({
          ...prev,
          isSubmitted: false,
          message: '',
        }));
      }, 5000);
    } catch (error) {
      setFormStatus({
        isSubmitting: false,
        isSubmitted: false,
        isError: true,
        message: 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.',
      });
    }
  };

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Bize <span className="text-blue-600">Ulaşın</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Sorularınız, önerileriniz veya işbirliği talepleriniz için bizimle
            iletişime geçebilirsiniz.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="bg-white rounded-xl shadow-lg p-8 transform transition-all duration-500 hover:shadow-xl">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">
              İletişim Formu
            </h3>

            {formStatus.message && (
              <div
                className={`mb-6 p-4 rounded-lg ${
                  formStatus.isError
                    ? 'bg-red-50 text-red-700'
                    : 'bg-green-50 text-green-700'
                }`}
              >
                <div className="flex items-start">
                  {formStatus.isError ? (
                    <MdInfo className="mt-0.5 mr-3 text-xl" />
                  ) : (
                    <MdCheck className="mt-0.5 mr-3 text-xl" />
                  )}
                  <p>{formStatus.message}</p>
                </div>
              </div>
            )}

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Adınız Soyadınız *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formState.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="Adınız Soyadınız"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    E-posta Adresiniz *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formState.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="ornek@email.com"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Telefon Numaranız
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formState.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="(5XX) XXX XX XX"
                  />
                </div>
                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Konu
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formState.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  >
                    <option value="">Konu Seçiniz</option>
                    <option value="general">Genel Bilgi</option>
                    <option value="support">Destek Talebi</option>
                    <option value="partnership">İş Birliği</option>
                    <option value="feedback">Öneri / Geri Bildirim</option>
                    <option value="other">Diğer</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Mesajınız *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formState.message}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="Mesajınızı buraya yazabilirsiniz..."
                  required
                ></textarea>
              </div>

              <div className="flex items-center">
                <input
                  id="privacy"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  required
                />
                <label
                  htmlFor="privacy"
                  className="ml-2 block text-sm text-gray-700"
                >
                  <span>Kişisel verilerimin işlenmesine ilişkin </span>
                  <a
                    href="/privacy-policy"
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Aydınlatma Metni
                  </a>
                  <span>'ni okudum ve kabul ediyorum.</span>
                </label>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={formStatus.isSubmitting}
                  className={`
                    w-full flex items-center justify-center px-6 py-3 
                    bg-blue-600 hover:bg-blue-700 text-white rounded-lg 
                    text-lg font-medium transition-all duration-300 shadow-md
                    ${
                      formStatus.isSubmitting
                        ? 'opacity-70 cursor-not-allowed'
                        : ''
                    }
                  `}
                >
                  {formStatus.isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Gönderiliyor...
                    </>
                  ) : (
                    <>
                      <MdSend className="mr-2" />
                      Gönder
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden h-64 md:h-80">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3008.232710472626!2d28.97881841541378!3d41.04605997929757!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab7a2a2c3b963%3A0x7671d1b9817b8519!2zxLBzdGFuYnVsLCBUw7xya2l5ZQ!5e0!3m2!1str!2str!4v1647887573273!5m2!1str!2str"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title="Ofis Konumumuz"
              ></iframe>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <MdPhone className="text-2xl text-blue-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-semibold text-gray-800">
                      Telefon
                    </h4>
                    <p className="text-gray-600 mt-1">
                      Pazartesi - Cuma, 09:00 - 18:00
                    </p>
                    <a
                      href="tel:+902121234567"
                      className="text-blue-600 hover:text-blue-800 font-medium block mt-2"
                    >
                      +90 (212) 123 45 67
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <MdEmail className="text-2xl text-blue-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-semibold text-gray-800">
                      E-posta
                    </h4>
                    <p className="text-gray-600 mt-1">
                      Size hızlıca dönüş yapacağız
                    </p>
                    <a
                      href="mailto:info@cozuldu.com"
                      className="text-blue-600 hover:text-blue-800 font-medium block mt-2"
                    >
                      info@cozuldu.com
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <MdLocationOn className="text-2xl text-blue-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-semibold text-gray-800">
                      Adres
                    </h4>
                    <p className="text-gray-600 mt-1">Merkez Ofisimiz</p>
                    <address className="text-gray-700 mt-2 not-italic">
                      Levent Mah. Büyükdere Cad. No:123
                      <br />
                      Şişli, İstanbul 34394
                    </address>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <MdAccessTime className="text-2xl text-blue-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-semibold text-gray-800">
                      Çalışma Saatleri
                    </h4>
                    <p className="text-gray-600 mt-1">Hizmetinizdeyiz</p>
                    <div className="text-gray-700 mt-2 space-y-1">
                      <p>Pazartesi - Cuma: 09:00 - 18:00</p>
                      <p>Cumartesi: 10:00 - 14:00</p>
                      <p>Pazar: Kapalı</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">
                Sosyal Medya
              </h4>
              <div className="flex flex-wrap gap-4">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors duration-300"
                  aria-label="Facebook"
                >
                  <MdFacebook className="text-2xl" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 text-white flex items-center justify-center hover:from-purple-700 hover:via-pink-600 hover:to-orange-500 transition-colors duration-300"
                  aria-label="Instagram"
                >
                  <FaInstagram className="text-2xl" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-blue-400 text-white flex items-center justify-center hover:bg-blue-500 transition-colors duration-300"
                  aria-label="Twitter"
                >
                  <FaTwitter className="text-2xl" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-blue-700 text-white flex items-center justify-center hover:bg-blue-800 transition-colors duration-300"
                  aria-label="LinkedIn"
                >
                  <FaLinkedinIn className="text-2xl" />
                </a>
                <a
                  href="https://wa.me/905551234567"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center hover:bg-green-600 transition-colors duration-300"
                  aria-label="WhatsApp"
                >
                  <MdWhatsapp className="text-2xl" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
