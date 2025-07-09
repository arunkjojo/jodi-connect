import React from 'react';
import { Search, Handshake } from 'lucide-react';
import LanguageSelector from './../components/LanguageSelector';
import { useTranslation } from 'react-i18next';
import NavigationBar from '../components/NavigationBar';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: 1,
      title: "Find Yourself",
      description: "Discover your ideal partner from a pool of curated matches. You'll share your interests and contact preferences directly.",
      icon: <Search className="w-8 h-8" />,
      plans: "Rs 600 / Rs 1200"
    },
    {
      number: 2,
      title: "We Help",
      description: "Let our experts assist you until a match is confirmed based on shared interests and preferences.",
      icon: <Handshake className="w-8 h-8" />,
      chargesNow: "Rs 0",
      confirmedMatch: "Rs 2400"
    }
  ];
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-pink-50">
      {/* Header */}
      {/* <header className="bg-gradient-to-r from-cyan-400 to-pink-400 text-white px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="p-2 rounded-full hover:bg-white/20 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-lg font-bold">How It Works</h1>
          <div className="w-8"></div>
        </div>
        <p className="text-sm mt-1 opacity-90 text-center">Find Your Match, Your Way!</p>
      </header> */}

      <header className="bg-gradient-to-r from-cyan-400 to-pink-400 text-white px-3 py-3 sm:px-4 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h1 className="text-sm sm:text-lg font-bold">{t('branding.appName')}</h1>
          </div>
          <LanguageSelector variant="header" />
        </div>
        <p className="text-xs sm:text-sm mt-1 opacity-90">{t('branding.tagline')}</p>
      </header>

      {/* Navigation Tabs */}
      
      <NavigationBar t={t} />

      <div className="px-4 pt-8 pb-20">
        <div className="max-w-full mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {steps.map((step) => (
            <div key={step.number} className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-yellow-200">
              <div className="flex items-center mb-4">
                <div className="bg-gradient-to-r from-cyan-500 to-pink-500 text-white p-2 sm:p-3 rounded-full mr-2 sm:mr-4">
                  {step.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-sm sm:text-lg text-gray-900">
                    {step.number}. {step.title}
                  </h3>
                </div>
              </div>
              
              <p className="text-gray-700 mb-4 text-xs sm:text-sm">{step.description}</p>
              
              <div className="space-y-2">
                {step.plans && (
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm text-gray-600">Plans:</span>
                    <span className="font-semibold text-gray-900 text-xs sm:text-sm">{step.plans}</span>
                  </div>
                )}
                {step.chargesNow && (
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm text-gray-600">Charges Now:</span>
                    <span className="font-semibold text-green-600 text-xs sm:text-sm">{step.chargesNow}</span>
                  </div>
                )}
                {step.confirmedMatch && (
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm text-gray-600">Upon Confirmed Match:</span>
                    <span className="font-semibold text-gray-900 text-xs sm:text-sm">{step.confirmedMatch}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
          </div>

          <div className="bg-gradient-to-r from-cyan-100 to-pink-100 p-4 sm:p-6 rounded-xl mt-6">
            <p className="text-center text-gray-700 text-sm">
              Choose the path that best suits your journey to finding your life partner.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;