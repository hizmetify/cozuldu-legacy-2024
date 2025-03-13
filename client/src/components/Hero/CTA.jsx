import { Link } from 'react-router-dom'
import {
  MdCheckCircle,
  MdArrowForward,
  MdGroups,
  MdCalendarToday,
  MdStar,
  MdEmojiEvents,
} from 'react-icons/md'

const CallToAction = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Hizmet Veren Olarak Katılın, Kazanmaya Başlayın
            </h2>
            <p className="text-lg text-blue-100 mb-8">
              Becerilerinizi ve hizmetlerinizi binlerce potansiyel müşteriye sunun. Çözüldü ile işlerinizi büyütün ve
              yeni müşterilere ulaşın.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <MdCheckCircle className="text-xl text-blue-200 mt-1 mr-3 h-5 w-5" />
                <p className="text-blue-100">
                  Ücretsiz profil oluşturun ve hizmetlerinizi sergileyin
                </p>
              </div>
              <div className="flex items-start">
                <MdCheckCircle className="text-xl text-blue-200 mt-1 mr-3 h-5 w-5" />
                <p className="text-blue-100">
                  Profil resmi yükleyerek güvenilirlik kazanın
                </p>
              </div>
              <div className="flex items-start">
                <MdCheckCircle className="text-xl text-blue-200 mt-1 mr-3 h-5 w-5" />
                <p className="text-blue-100">
                  Müşteri değerlendirmeleriyle itibarınızı artırın
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/register"
                className="px-6 py-3 bg-white text-blue-700 rounded-lg font-medium hover:bg-blue-50 transition-colors shadow-md hover:shadow-lg"
              >
                Hemen Kaydolun
              </Link>
              <Link
                to="/how-it-works"
                className="px-6 py-3 bg-transparent border border-white text-white rounded-lg font-medium hover:bg-white/10 transition-colors flex items-center"
              >
                Nasıl Çalışır
                <MdArrowForward className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-xl">
              <h3 className="text-xl font-bold mb-6 text-center">
                Nasıl Çalışır?
              </h3>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-blue-500 rounded-full p-3 mr-4">
                    <MdGroups className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Profil Oluşturun</h4>
                    <p className="text-blue-100 text-sm mt-1">
                      Birkaç dakika içinde profesyonel profilinizi oluşturun ve
                      hizmetlerinizi tanıtın.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-blue-500 rounded-full p-3 mr-4">
                    <MdCalendarToday className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Hizmetlerinizi ilan açarak sergileyin</h4>
                    <p className="text-blue-100 text-sm mt-1">
                    Bölgenizde rağbet gören sektörlerden hizmet verip ve ilan açıp müşteri kazanın
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-blue-500 rounded-full p-3 mr-4">
                    <MdStar className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">
                      Değerlendirme Toplayın
                    </h4>
                    <p className="text-blue-100 text-sm mt-1">
                      Memnun müşterilerden olumlu değerlendirmeler alarak
                      profilinizi güçlendirin.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-blue-500 rounded-full p-3 mr-4">
                    <MdEmojiEvents className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">İşinizi Büyütün</h4>
                    <p className="text-blue-100 text-sm mt-1">
                      Artan müşteri ağınızla işinizi büyütün ve daha fazla kazanç
                      elde edin.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -top-6 -right-6 w-12 h-12 rounded-lg bg-blue-400 rotate-12"></div>
            <div className="absolute -bottom-6 -left-6 w-12 h-12 rounded-lg bg-blue-500 -rotate-12"></div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CallToAction
