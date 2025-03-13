import { useState } from 'react';
import { MdSearch, MdHandshake, MdStar, MdArrowForward } from 'react-icons/md';
import { Link } from 'react-router-dom';

const HowItWorks = () => {
  const [hoveredStep, setHoveredStep] = useState(null);

  const steps = [
    {
      id: 1,
      icon: <MdSearch className="text-4xl text-blue-500" />,
      title: 'Hizmet Seçin',
      description:
        'İhtiyacınız olan hizmeti seçin ve ilan sahibi ile iletişime geçin.',
      color: 'from-blue-500 to-blue-600',
    },
    {
      id: 2,
      icon: <MdHandshake className="text-4xl text-blue-500" />,
      title: 'Teklifleri Alın',
      description: 'Onaylı hizmet verenlerden uygun teklifleri hemen alın.',
      color: 'from-blue-600 to-blue-700',
    },
    {
      id: 3,
      icon: <MdStar className="text-4xl text-blue-500" />,
      title: 'Hizmeti Değerlendirin',
      description: 'Aldığınız hizmeti değerlendirerek topluma katkıda bulunun.',
      color: 'from-blue-700 to-blue-800',
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Nasıl <span className="text-blue-600">Çalışır?</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Çözüldü ile ihtiyacınız olan hizmete ulaşmak sadece üç adım
            uzağınızda
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {steps.map((step) => (
            <div
              key={step.id}
              className="relative bg-white rounded-xl shadow-md transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl"
              onMouseEnter={() => setHoveredStep(step.id)}
              onMouseLeave={() => setHoveredStep(null)}
            >
              <div className="absolute -top-5 -left-5 w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                {step.id}
              </div>

              <div className="p-8 text-center">
                <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 transition-all duration-300">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.description}</p>
              </div>

              {step.id < steps.length && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-blue-200 z-0">
                  <div
                    className={`h-full bg-gradient-to-r ${step.color} transition-all duration-500`}
                    style={{
                      width:
                        hoveredStep && hoveredStep >= step.id ? '100%' : '0%',
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/register"
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Hemen Başlayın
            <MdArrowForward className="ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
