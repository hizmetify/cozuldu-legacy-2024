import { memo } from 'react';
import PropTypes from 'prop-types';
import {
  FaCheck,
  FaCircle,
  FaDotCircle,
  FaUser,
  FaEnvelope,
  FaKey,
  FaArrowRight,
  FaCheckCircle,
} from 'react-icons/fa';

const steps = [
  {
    step: 1,
    title: 'Kişisel Bilgiler',
    path: '/register/step-1',
    description: 'Ad, soyad ve temel bilgileriniz',
    icon: FaUser,
  },
  {
    step: 2,
    title: 'İletişim ve Profil',
    path: '/register/step-2',
    description: 'İletişim bilgileri ve profil detayları',
    icon: FaEnvelope,
  },
  {
    step: 3,
    title: 'Şifre Belirleme',
    path: '/register/step-3',
    description: 'Güvenli şifre oluşturma',
    icon: FaKey,
  },
];
const MobileStepIndicator = ({ step, isCompleted, isActive }) => {
  return (
    <div className="flex flex-col items-center">
      <div
        className={`
          relative flex items-center justify-center w-10 h-10 rounded-full
          transition-all duration-500 z-10
          ${
            isCompleted
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : isActive
              ? 'bg-white text-blue-700 shadow-md'
              : 'bg-white/10 text-blue-100'
          }
        `}
      >
        {isCompleted ? (
          <FaCheckCircle className="text-xl" />
        ) : isActive ? (
          <FaDotCircle className="text-xl" />
        ) : (
          <FaCircle className="text-lg opacity-70" />
        )}

        {isActive && (
          <span className="absolute w-full h-full rounded-full bg-white/30 animate-ping opacity-75"></span>
        )}
      </div>
      <span className="text-[10px] mt-2 font-medium text-center text-white/80 max-w-[70px] truncate">
        {step.title}
      </span>
    </div>
  );
};

MobileStepIndicator.propTypes = {
  step: PropTypes.shape({
    step: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
    description: PropTypes.string,
    icon: PropTypes.elementType,
  }).isRequired,
  isCompleted: PropTypes.bool.isRequired,
  isActive: PropTypes.bool.isRequired,
};

const StepIndicator = ({ step, index, currentStepIndex, isLast }) => {
  const isCompleted = index < currentStepIndex;
  const isActive = index === currentStepIndex;
  const Icon = step.icon;

  return (
    <div className="relative">
      <div className="flex items-center gap-4">
        <div
          className={`
          relative flex items-center justify-center w-14 h-14 rounded-full
          shadow-md transition-all duration-300 z-10
          ${
            isCompleted
              ? 'bg-blue-600 text-white'
              : isActive
              ? 'bg-white text-blue-700 ring-4 ring-blue-600/30'
              : 'bg-white/20 text-blue-100'
          }
        `}
        >
          {isCompleted ? (
            <FaCheckCircle className="text-2xl" />
          ) : (
            <div className="flex items-center justify-center">
              <Icon className="text-2xl" />
            </div>
          )}

          {isActive && (
            <span className="absolute -inset-1 rounded-full bg-white/20 animate-pulse"></span>
          )}
        </div>

        <div className="flex flex-col">
          <span className="text-xs font-semibold text-blue-200 tracking-wider flex items-center">
            ADIM {step.step}
            {isCompleted && <FaCheck className="text-xs ml-1 text-green-300" />}
          </span>
          <span
            className={`text-sm font-bold tracking-wide ${
              isActive ? 'text-white drop-shadow-md' : 'text-blue-100'
            }`}
          >
            {step.title}
          </span>
          <span className="text-xs text-blue-200/70 mt-0.5 max-w-[200px]">
            {step.description}
          </span>
        </div>
      </div>
      {!isLast && (
        <div className="absolute left-7 top-14 w-0.5 h-[calc(100%-14px)] bg-white/20 transform -translate-x-1/2">
          <div
            className="h-full bg-blue-600 transition-all duration-700 ease-out"
            style={{
              height: isCompleted ? '100%' : isActive ? '50%' : '0%',
            }}
          ></div>
        </div>
      )}
    </div>
  );
};

StepIndicator.propTypes = {
  step: PropTypes.shape({
    step: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
    description: PropTypes.string,
    icon: PropTypes.elementType,
  }).isRequired,
  index: PropTypes.number.isRequired,
  currentStepIndex: PropTypes.number.isRequired,
  isLast: PropTypes.bool.isRequired,
};
const MobileProgressIndicator = ({ percentage, currentStep, totalSteps }) => {
  return (
    <div className="flex items-center justify-between p-3">
      <div className="flex items-center">
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 rounded-full bg-white/10"></div>
          <svg
            className="absolute inset-0 w-full h-full -rotate-90"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="white"
              strokeWidth="8"
              strokeDasharray="283"
              strokeDashoffset={283 - (283 * percentage) / 100}
              strokeLinecap="round"
              className="transition-all duration-700 ease-out"
            />
          </svg>

          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white text-lg font-bold">
              {Math.round(percentage)}%
            </span>
          </div>
        </div>

        <div className="ml-3 text-white/90 text-xs">
          <p className="font-medium text-white">Kayıt İşlemi</p>
          <p className="text-blue-100">
            Adım {currentStep} / {totalSteps}
          </p>
        </div>
      </div>

      <div className="flex items-center text-white/90 text-xs">
        <span className="mr-1">Devam Et</span>
        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
          <FaArrowRight className="text-xs" />
        </div>
      </div>
    </div>
  );
};

MobileProgressIndicator.propTypes = {
  percentage: PropTypes.number.isRequired,
  currentStep: PropTypes.number.isRequired,
  totalSteps: PropTypes.number.isRequired,
};

const Stepper = ({ currentStepIndex }) => {
  const safeStepIndex = Math.max(
    0,
    Math.min(currentStepIndex, steps.length - 1)
  );

  const progressPercentage = (safeStepIndex / (steps.length - 1)) * 100;

  return (
    <div className="relative w-full h-full text-white overflow-hidden bg-gradient-to-r from-blue-600 to-blue-800">
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/30 rounded-full blur-3xl" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/30 rounded-full blur-3xl" />
      <svg
        className="absolute bottom-0 left-0 w-full h-auto text-blue-500/20"
        viewBox="0 0 1440 320"
      >
        <path
          fill="currentColor"
          fillOpacity="1"
          d="M0,256L48,256C96,256,192,256,288,245.3C384,235,480,213,576,192C672,171,768,149,864,160C960,171,1056,213,1152,208C1248,203,1344,149,1392,122.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        />
      </svg>
      <div className="absolute -top-6 -right-6 w-12 h-12 rounded-lg bg-blue-400 rotate-12 opacity-50"></div>
      <div className="absolute -bottom-6 -left-6 w-12 h-12 rounded-lg bg-blue-500 -rotate-12 opacity-50"></div>
      <div className="w-full h-2 bg-white/10">
        <div
          className="h-full bg-white transition-all duration-700 ease-out"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      <div className="md:hidden">
        <div className="flex justify-around items-center p-4">
          {steps.map((step, index) => (
            <MobileStepIndicator
              key={index}
              step={step}
              isCompleted={index < safeStepIndex}
              isActive={index === safeStepIndex}
            />
          ))}
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-white/10 backdrop-blur-sm border-t border-white/20">
          <MobileProgressIndicator
            percentage={progressPercentage}
            currentStep={safeStepIndex + 1}
            totalSteps={steps.length}
          />
        </div>
      </div>
      <div className="hidden md:flex flex-col gap-16 p-8 relative z-10">
        {steps.map((step, index) => (
          <StepIndicator
            key={index}
            step={step}
            index={index}
            currentStepIndex={safeStepIndex}
            isLast={index === steps.length - 1}
          />
        ))}
      </div>

      <div className="hidden md:block absolute bottom-4 right-4 bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20 shadow-lg">
        <div className="flex items-center gap-2">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full bg-white/10"></div>
            <svg
              className="absolute inset-0 w-full h-full -rotate-90"
              viewBox="0 0 100 100"
            >
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="white"
                strokeWidth="8"
                strokeDasharray="283"
                strokeDashoffset={283 - (283 * progressPercentage) / 100}
                strokeLinecap="round"
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white text-xl font-bold">
                {Math.round(progressPercentage)}%
              </span>
            </div>
          </div>
          <p className="text-xs text-blue-100">
            Kayıt işleminizi
            <br />
            tamamlamak için
            <br />
            adımları takip edin
          </p>
        </div>
      </div>
    </div>
  );
};

Stepper.propTypes = {
  currentStepIndex: PropTypes.number.isRequired,
};

export default memo(Stepper);
