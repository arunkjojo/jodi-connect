import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { LANGUAGES } from '../constants';
import type { Language } from '../types';

interface LanguageSelectorProps {
  variant?: 'header' | 'dropdown';
  className?: string;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  variant = 'header',
  className = ''
}) => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage = LANGUAGES.find(lang => lang.code === i18n.language) || LANGUAGES[0];

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    setIsOpen(false);
  };

  if (variant === 'header') {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm font-semibold hover:bg-white/30 transition-colors ${className}`}
          aria-label="Select Language"
        >
          {currentLanguage.icon}
        </button>

        <AnimatePresence>
          {isOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 min-w-[140px] sm:min-w-[160px]"
              >
                {LANGUAGES.map((language: Language) => (
                  <button
                    key={language.code}
                    onClick={() => handleLanguageChange(language.code)}
                    className={`w-full text-left px-3 py-2 text-xs sm:text-sm hover:bg-gray-100 transition-colors ${i18n.language === language.code ? 'bg-cyan-50 text-cyan-600 font-medium' : 'text-gray-700'
                      }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="font-semibold min-w-[20px] text-center">
                        {language.icon}
                      </span>
                      <div className="flex flex-col">
                        <span>{language.name}</span>
                        <span className="text-xs opacity-70">{language.nativeName}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-white text-sm"
      >
        <div className="flex items-center space-x-2">
          <span className="font-semibold min-w-[20px] text-center">
            {currentLanguage.icon}
          </span>
          <span>{currentLanguage.nativeName}</span>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
            >
              {LANGUAGES.map((language: Language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 transition-colors ${i18n.language === language.code ? 'bg-cyan-50 text-cyan-600 font-medium' : 'text-gray-700'
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="font-semibold min-w-[20px] text-center">
                        {language.icon}
                      </span>
                      <span>{language.name}</span>
                    </div>
                    <span className="text-xs opacity-70">{language.nativeName}</span>
                  </div>
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSelector;