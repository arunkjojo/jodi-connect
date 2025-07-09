import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useRegistrationStore } from '../store';

interface ProgressTrackerProps {
  steps: Array<{
    number: number;
    title: string;
    icon: string;
  }>;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ steps }) => {
  const { currentStep } = useRegistrationStore();

  return (
    <div className="bg-white px-4 py-4 shadow-sm">
      <div className="flex items-center justify-between max-w-md mx-auto">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div className="flex flex-col items-center">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  currentStep > step.number
                    ? 'bg-green-500 text-white'
                    : currentStep === step.number
                    ? 'bg-gradient-to-r from-cyan-500 to-pink-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {currentStep > step.number ? (
                  <Check size={16} />
                ) : (
                  <span className="text-xs sm:text-sm">{step.icon}</span>
                )}
              </motion.div>
              
              <span className="text-xs mt-1 text-center text-gray-600 max-w-[60px] sm:max-w-none">
                {step.title}
              </span>
            </div>
            
            {index < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 transition-all ${
                currentStep > step.number 
                  ? 'bg-green-500' 
                  : 'bg-gray-200'
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ProgressTracker;