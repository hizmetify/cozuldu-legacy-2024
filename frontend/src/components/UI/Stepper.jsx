import { FaCheck } from 'react-icons/fa';
import { memo } from 'react';

const Stepper = ({ steps, currentStep }) => {
  return (
    <div className="w-full px-4 py-6 mb-6">
      <div className="relative flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <div className="flex flex-col gap-0.5 items-center">
              <div
                className={`w-10 h-10 rounded-full border border-indigo-500 flex items-center justify-center
                transition-colors duration-200 ${
                  currentStep === index
                    ? 'bg-indigo-500 text-white'
                    : currentStep > index
                    ? 'text-green-600 border-green-600'
                    : 'text-indigo-500'
                }`}
              >
                <span className="text-base font-semibold">
                  {currentStep > index ? <FaCheck /> : index + 1}
                </span>
              </div>
              <span className="text-sm font-medium text-center">
                {step.name}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default memo(Stepper);
