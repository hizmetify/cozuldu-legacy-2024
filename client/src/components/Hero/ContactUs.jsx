/* "use client"

import { useState, useRef } from "react"
import {
  MdEmail,
  MdSend,
  MdCheck,
  MdInfo,
  MdOutlineChat,
  MdOutlineQuestionAnswer,
  MdOutlineHeadsetMic,
  MdOutlineArticle,
  MdOutlineVideocam,
} from "react-icons/md"
import { FaDiscord, FaSlack, FaTelegram } from "react-icons/fa"

const ContactUs = () => {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const [formStatus, setFormStatus] = useState({
    isSubmitting: false,
    isSubmitted: false,
    isError: false,
    message: "",
  })

  const [activeSupport, setActiveSupport] = useState("email")

  const formRef = useRef(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formState.name || !formState.email || !formState.message) {
      setFormStatus({
        isSubmitting: false,
        isSubmitted: false,
        isError: true,
        message: "Lütfen gerekli alanları doldurun.",
      })
      return
    }

    setFormStatus({
      isSubmitting: true,
      isSubmitted: false,
      isError: false,
      message: "",
    })

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setFormStatus({
        isSubmitting: false,
        isSubmitted: true,
        isError: false,
        message: "Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.",
      })

      setFormState({
        name: "",
        email: "",
        subject: "",
        message: "",
      })

      setTimeout(() => {
        setFormStatus((prev) => ({
          ...prev,
          isSubmitted: false,
          message: "",
        }))
      }, 5000)
    } catch (error) {
      setFormStatus({
        isSubmitting: false,
        isSubmitted: false,
        isError: true,
        message: "Bir hata oluştu. Lütfen daha sonra tekrar deneyin.",
      })
    }
  }

  const supportOptions = [
    {
      id: "email",
      icon: <MdEmail className="text-2xl" />,
      title: "E-posta Desteği",
      description: "Sorularınızı e-posta ile yanıtlıyoruz",
      content: (
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
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
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
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

          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
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

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
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
            <label htmlFor="privacy" className="ml-2 block text-sm text-gray-700">
              <span>Kişisel verilerimin işlenmesine ilişkin </span>
              <a href="/privacy-policy" className="text-blue-600 hover:text-blue-800 font-medium">
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
                ${formStatus.isSubmitting ? "opacity-70 cursor-not-allowed" : ""}
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
      ),
    },
    {
      id: "chat",
      icon: <MdOutlineChat className="text-2xl" />,
      title: "Canlı Destek",
      description: "Anlık destek için canlı sohbet",
      content: (
        <div className="text-center py-8">
          <div className="bg-blue-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <MdOutlineHeadsetMic className="text-4xl text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold mb-3">Canlı Destek Başlatın</h3>
          <p className="text-gray-600 mb-6">
            Uzman ekibimiz sorularınızı yanıtlamak için hazır. Hemen canlı destek başlatın ve anında yardım alın.
          </p>
          <button className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-300">
            <MdOutlineChat className="mr-2" />
            Sohbeti Başlat
          </button>
          <p className="text-sm text-gray-500 mt-4">Çalışma Saatleri: 08:00 - 22:00</p>
        </div>
      ),
    },
    {
      id: "community",
      icon: <FaDiscord className="text-2xl" />,
      title: "Topluluk Desteği",
      description: "Topluluk kanallarımıza katılın",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6">
          <div className="bg-[#5865F2]/10 rounded-xl p-6 text-center hover:shadow-md transition-shadow duration-300">
            <div className="w-16 h-16 bg-[#5865F2] rounded-full flex items-center justify-center mx-auto mb-4">
              <FaDiscord className="text-3xl text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Discord</h3>
            <p className="text-gray-600 mb-4">Topluluğumuza katılın ve diğer kullanıcılarla etkileşime geçin.</p>
            <a
              href="https://discord.gg/example"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-[#5865F2] hover:bg-[#4752c4] text-white rounded-lg text-sm font-medium transition-colors duration-300"
            >
              Katıl
            </a>
          </div>

          <div className="bg-[#4A154B]/10 rounded-xl p-6 text-center hover:shadow-md transition-shadow duration-300">
            <div className="w-16 h-16 bg-[#4A154B] rounded-full flex items-center justify-center mx-auto mb-4">
              <FaSlack className="text-3xl text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Slack</h3>
            <p className="text-gray-600 mb-4">İş birliği ve destek için Slack kanalımıza katılın.</p>
            <a
              href="https://slack.com/example"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-[#4A154B] hover:bg-[#3a1039] text-white rounded-lg text-sm font-medium transition-colors duration-300"
            >
              Katıl
            </a>
          </div>

          <div className="bg-[#0088cc]/10 rounded-xl p-6 text-center hover:shadow-md transition-shadow duration-300">
            <div className="w-16 h-16 bg-[#0088cc] rounded-full flex items-center justify-center mx-auto mb-4">
              <FaTelegram className="text-3xl text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Telegram</h3>
            <p className="text-gray-600 mb-4">Hızlı güncellemeler ve duyurular için Telegram grubumuz.</p>
            <a
              href="https://t.me/example"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-[#0088cc] hover:bg-[#0077b3] text-white rounded-lg text-sm font-medium transition-colors duration-300"
            >
              Katıl
            </a>
          </div>
        </div>
      ),
    },
    {
      id: "self-service",
      icon: <MdOutlineQuestionAnswer className="text-2xl" />,
      title: "Self Servis",
      description: "Yardım merkezi ve kaynaklar",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6">
          <div className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <MdOutlineArticle className="text-2xl text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <h4 className="text-lg font-semibold text-gray-800">Bilgi Merkezi</h4>
                <p className="text-gray-600 mt-1">Detaylı rehberler ve makaleler</p>
                <a href="/help-center" className="text-blue-600 hover:text-blue-800 font-medium block mt-2">
                  Bilgi Merkezini Ziyaret Et
                </a>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <MdOutlineVideocam className="text-2xl text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <h4 className="text-lg font-semibold text-gray-800">Video Eğitimler</h4>
                <p className="text-gray-600 mt-1">Adım adım görsel rehberler</p>
                <a href="/tutorials" className="text-blue-600 hover:text-blue-800 font-medium block mt-2">
                  Eğitimleri İzle
                </a>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow duration-300 md:col-span-2">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Sık Sorulan Sorular</h4>
            <div className="space-y-4">
              <div className="border-b border-gray-200 pb-4">
                <h5 className="font-medium text-gray-800 mb-2">Platformu nasıl kullanabilirim?</h5>
                <p className="text-gray-600">
                  Platformumuzu kullanmak için öncelikle üye olmanız ve profil bilgilerinizi doldurmanız gerekmektedir.
                  Ardından ana sayfadan ihtiyacınız olan hizmeti seçerek talep oluşturabilirsiniz.
                </p>
              </div>
              <div className="border-b border-gray-200 pb-4">
                <h5 className="font-medium text-gray-800 mb-2">Ödeme yöntemleri nelerdir?</h5>
                <p className="text-gray-600">
                  Platformumuzda kredi kartı, banka kartı ve havale/EFT yöntemleriyle güvenli ödeme yapabilirsiniz. Tüm
                  ödemeler SSL sertifikası ile korunmaktadır.
                </p>
              </div>
              <div>
                <a href="/faq" className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center">
                  Tüm SSS'leri Görüntüle
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 ml-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ]

  const activeOption = supportOptions.find((option) => option.id === activeSupport)

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Bize <span className="text-blue-600">Ulaşın</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Sorularınız, önerileriniz veya destek talepleriniz için size en uygun iletişim kanalını seçin.
          </p>
        </div>

        {formStatus.message && (
          <div
            className={`mb-6 p-4 rounded-lg max-w-3xl mx-auto ${
              formStatus.isError ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
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

        <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4">
            <div className="bg-gray-50 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">İletişim Kanalları</h3>
              <nav className="space-y-2">
                {supportOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setActiveSupport(option.id)}
                    className={`w-full flex items-center p-3 rounded-lg transition-colors duration-200 ${
                      activeSupport === option.id ? "bg-blue-50 text-blue-700" : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    <span className={`mr-3 ${activeSupport === option.id ? "text-blue-600" : "text-gray-500"}`}>
                      {option.icon}
                    </span>
                    <div className="text-left">
                      <div className={`font-medium ${activeSupport === option.id ? "text-blue-700" : "text-gray-800"}`}>
                        {option.title}
                      </div>
                      <div className="text-xs text-gray-500">{option.description}</div>
                    </div>
                  </button>
                ))}
              </nav>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Çalışma Saatleri</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Pazartesi - Cuma: 09:00 - 18:00</p>
                  <p>Cumartesi: 10:00 - 14:00</p>
                  <p>Pazar: Kapalı</p>
                </div>
              </div>
            </div>

            <div className="p-6 md:col-span-3">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">{activeOption?.title}</h3>
              {activeOption?.content}
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Müşteri Memnuniyeti Önceliğimizdir</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-blue-50 rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="text-4xl font-bold text-blue-600 mb-2">15 dk</div>
              <div className="text-gray-700">Ortalama Yanıt Süresi</div>
            </div>
            <div className="bg-blue-50 rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="text-4xl font-bold text-blue-600 mb-2">24/7</div>
              <div className="text-gray-700">Online Destek</div>
            </div>
            <div className="bg-blue-50 rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="text-4xl font-bold text-blue-600 mb-2">98%</div>
              <div className="text-gray-700">Müşteri Memnuniyeti</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContactUs

 */