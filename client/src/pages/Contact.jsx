import { useState, useEffect } from 'react';
import FAQ from '../components/Hero/FAQ';
import { useDispatch } from 'react-redux';

import { MdHeadsetMic, MdQuestionAnswer, MdSupportAgent } from 'react-icons/md';
import { startLoading, stopLoading } from '../features/loading/loadingSlice';

const Contact = () => {
  const [activeTab, setActiveTab] = useState('faq');
  const dispatch = useDispatch();
  const [isContentLoading, setIsContentLoading] = useState(false);

  useEffect(() => {
    if (isContentLoading) {
      dispatch(startLoading({ message: 'İletişim sayfası yükleniyor' }));
    } else {
      dispatch(stopLoading());
    }
  }, [isContentLoading, dispatch]);

  useEffect(() => {
    const loadContent = async () => {
      setIsContentLoading(true);

      await new Promise((resolve) => setTimeout(resolve, 500));
      setIsContentLoading(false);
    };

    loadContent();
  }, [activeTab]);

  return (

      <div className="bg-gradient-to-b from-blue-50 via-white to-gray-50 min-h-screen">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Nasıl Yardımcı Olabiliriz?
              </h1>
              <p className="text-xl text-blue-100 mb-8">
                Sık sorulan sorular ve iletişim bilgilerimiz ile size yardımcı
                olmak için buradayız.
              </p>

              <div className="inline-flex bg-white/10 backdrop-blur-sm rounded-lg p-1.5 shadow-lg">
                <button
                  onClick={() => setActiveTab('faq')}
                  className="px-6 py-3 rounded-md font-medium text-sm md:text-base transition-all duration-200 flex items-center bg-white text-blue-700 shadow-sm"
                >
                  <MdQuestionAnswer className="mr-2 text-lg" />
                  Sık Sorulan Sorular
                </button>
              </div>
            </div>
          </div>
        </div>
    
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
          <div className="absolute top-0 left-0 w-64 h-64 bg-blue-100 rounded-full opacity-20 -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>

          <div className="relative">
            <div
              className={`transition-all duration-500 ${
                activeTab === 'faq'
                  ? 'opacity-100'
                  : 'opacity-0 absolute inset-0 pointer-events-none'
              }`}
            >
              <FAQ />
            </div>
{/*             <div
              className={`transition-all duration-500 ${
                activeTab === 'contact'
                  ? 'opacity-100'
                  : 'opacity-0 absolute inset-0 pointer-events-none'
              }`}
            >
            </div> */}
          </div>
        </div>
{/*         <div className="bg-white py-16 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">
                Müşteri Memnuniyeti
              </h2>
              <p className="text-lg text-gray-600 mt-2">
                Müşterilerimize en iyi hizmeti sunmak için çalışıyoruz
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-blue-50 rounded-xl p-8 text-center shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="text-4xl font-bold text-blue-600 mb-2">98%</div>
                <div className="text-gray-700">Müşteri Memnuniyeti</div>
              </div>
              <div className="bg-blue-50 rounded-xl p-8 text-center shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  24/7
                </div>
                <div className="text-gray-700">Müşteri Desteği</div>
              </div>
              <div className="bg-blue-50 rounded-xl p-8 text-center shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  10K+
                </div>
                <div className="text-gray-700">Çözülen Sorun</div>
              </div>
            </div>
          </div>
        </div> */}
      </div>
  );
};

export default Contact;
