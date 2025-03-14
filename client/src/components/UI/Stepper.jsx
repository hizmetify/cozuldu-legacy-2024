import { FaCheck, FaChevronRight, FaChevronLeft } from "react-icons/fa6"
import { memo, useState, useEffect } from "react"
import PropTypes from "prop-types"
import { motion, AnimatePresence } from "framer-motion"

const steps = [
  { step: 1, title: "Kişisel Bilgiler", path: "/register/step-1", description: "Ad, soyad ve temel bilgileriniz" },
  {
    step: 2,
    title: "İletişim ve Profil",
    path: "/register/step-2",
    description: "İletişim bilgileri ve profil detayları",
  },
  { step: 3, title: "Şifre Belirleme", path: "/register/step-3", description: "Güvenli şifre oluşturma" },
]

const StepIndicator = ({ step, index, currentStepIndex }) => {
  const isCompleted = index < currentStepIndex
  const isActive = index === currentStepIndex

  const circleStyles = `
    flex items-center justify-center w-12 h-12 rounded-full text-lg font-medium 
    shadow-md transition-all duration-300
    ${
      isCompleted
        ? "bg-blue-600 text-white border-4 border-blue-600"
        : isActive
        ? "bg-white text-blue-700 border-4 border-blue-600"
        : "bg-white/20 text-blue-100 border-4 border-white/20"
    }
  `

  return (
    <div className="flex items-center gap-4">
      <div className={circleStyles}>
        {isCompleted ? <FaCheck className="text-xl" /> : step.step}
      </div>
      <div className="flex flex-col">
        <span className="text-xs font-semibold text-blue-200 tracking-wider">
          ADIM {step.step}
        </span>
        <span
          className={`text-sm font-bold tracking-wide ${
            isActive ? "text-white drop-shadow-md" : "text-blue-100"
          }`}
        >
          {step.title}
        </span>
      </div>
    </div>
  )
}

StepIndicator.propTypes = {
  step: PropTypes.shape({
    step: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
    description: PropTypes.string,
  }).isRequired,
  index: PropTypes.number.isRequired,
  currentStepIndex: PropTypes.number.isRequired,
}

const MobileStepIndicator = ({ step, isCompleted, isActive, isLast, progress }) => {
  return (
    <div className="flex flex-col items-center">
      <div
        className={`
          relative flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium 
          transition-all duration-500 z-10
          ${
            isCompleted
              ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
              : isActive
              ? "bg-white text-blue-700 border-2 border-white shadow-lg"
              : "bg-white/10 text-blue-100 border border-white/20"
          }
        `}
      >
        {isCompleted ? <FaCheck className="text-sm" /> : step.step}
        {isActive && (
          <span className="absolute w-full h-full rounded-full bg-white/30 animate-ping opacity-75"></span>
        )}
      </div>

      {!isLast && (
        <div className="w-full h-1 bg-white/10 relative mt-2">
          <div
            className="absolute top-0 left-0 h-full bg-blue-600 transition-all duration-500"
            style={{
              width: isCompleted ? "100%" : isActive ? `${progress}%` : "0%",
            }}
          ></div>
        </div>
      )}
    </div>
  )
}

MobileStepIndicator.propTypes = {
  step: PropTypes.shape({
    step: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
    description: PropTypes.string,
  }).isRequired,
  isCompleted: PropTypes.bool.isRequired,
  isActive: PropTypes.bool.isRequired,
  isLast: PropTypes.bool.isRequired,
  progress: PropTypes.number.isRequired,
}

const Stepper = ({ currentStepIndex }) => {
  const safeStepIndex = Math.max(0, Math.min(currentStepIndex, steps.length - 1))

  const [progress, setProgress] = useState(0)
  const [showMobileDetail, setShowMobileDetail] = useState(true)

  useEffect(() => {
    setProgress(0)
    const timer = setTimeout(() => {
      setProgress(30)
    }, 500)
    return () => clearTimeout(timer)
  }, [safeStepIndex])

  return (
    <div className="relative w-full h-full text-white overflow-hidden bg-gradient-to-r from-blue-600 to-blue-800">
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/30 rounded-full blur-3xl" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/30 rounded-full blur-3xl" />
      <svg className="absolute bottom-0 left-0 w-full h-auto text-blue-500/20" viewBox="0 0 1440 320">
        <path
          fill="currentColor"
          fillOpacity="1"
          d="M0,256L48,256C96,256,192,256,288,245.3C384,235,480,213,576,192C672,171,768,149,864,160C960,171,1056,213,1152,208C1248,203,1344,149,1392,122.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        />
      </svg>
      <div className="absolute -top-6 -right-6 w-12 h-12 rounded-lg bg-blue-400 rotate-12 opacity-50"></div>
      <div className="absolute -bottom-6 -left-6 w-12 h-12 rounded-lg bg-blue-500 -rotate-12 opacity-50"></div>

      <div className="md:hidden w-full relative">
        <div className="w-full h-1 bg-white/10">
          <div
            className="h-full bg-white transition-all duration-700 ease-in-out"
            style={{
              width: `${(safeStepIndex / steps.length) * 100}%`,
            }}
          ></div>
        </div>

        <div className="px-4 py-5">
          <div className="grid grid-cols-3 gap-2">
            {steps.map((step, index) => (
              <MobileStepIndicator
                key={index}
                step={step}
                isCompleted={index < safeStepIndex}
                isActive={index === safeStepIndex}
                isLast={index === steps.length - 1}
                progress={
                  index < safeStepIndex
                    ? 100
                    : index === safeStepIndex
                    ? progress
                    : 0
                }
              />
            ))}
          </div>

          {/* Step Titles */}
          <div className="grid grid-cols-3 gap-2 mt-2 text-center">
            {steps.map((step, index) => (
              <div key={index} className="px-1">
                <span
                  className={`text-[10px] font-medium transition-all duration-300
                    ${index === safeStepIndex ? "text-white" : "text-blue-100/80"}
                  `}
                >
                  {step.title}
                </span>
              </div>
            ))}
          </div>
          <AnimatePresence mode="wait">
            {showMobileDetail && steps[safeStepIndex] && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                key={safeStepIndex}
                className="mt-5 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-lg"
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-blue-500 rounded-full p-2 mr-3">
                    <span className="text-white font-bold text-sm">
                      {safeStepIndex + 1}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">
                      {steps[safeStepIndex].title}
                    </h3>
                    <p className="text-blue-100 text-sm mt-1">
                      {steps[safeStepIndex].description ||
                        "Bu adımı tamamlayın ve devam edin"}
                    </p>
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-4">
                  <button
                    className={`flex items-center px-3 py-1.5 rounded-lg text-sm
                      ${
                        safeStepIndex > 0
                          ? "bg-white/10 text-white hover:bg-white/20"
                          : "bg-white/5 text-blue-200/50 cursor-not-allowed"
                      }`}
                    disabled={safeStepIndex === 0}
                  >
                    <FaChevronLeft className="mr-1 text-xs" /> Önceki
                  </button>

                  <button className="flex items-center px-3 py-1.5 bg-white text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-50">
                    {safeStepIndex < steps.length - 1 ? (
                      <>
                        Sonraki <FaChevronRight className="ml-1 text-xs" />
                      </>
                    ) : (
                      "Tamamla"
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <button
            onClick={() => setShowMobileDetail(!showMobileDetail)}
            className="absolute top-5 right-4 w-6 h-6 flex items-center justify-center rounded-full bg-white/10 text-white/80 hover:bg-white/20"
          >
            {showMobileDetail ? "-" : "+"}
          </button>
        </div>
      </div>

      <div className="hidden md:flex flex-col gap-8 p-8 relative z-10">
        {steps.map((step, index) => (
          <StepIndicator
            key={index}
            step={step}
            index={index}
            currentStepIndex={safeStepIndex}
          />
        ))}
      </div>

      <div className="absolute hidden md:block bottom-4 right-4 bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20 shadow-lg">
        <p className="text-xs text-blue-100">
          Kayıt işleminizi tamamlamak için adımları takip edin
        </p>
      </div>
    </div>
  )
}

Stepper.propTypes = {
  currentStepIndex: PropTypes.number.isRequired,
}

export default memo(Stepper)
