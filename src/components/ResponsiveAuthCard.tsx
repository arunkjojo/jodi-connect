import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Heart } from 'lucide-react';
import LanguageSelector from './LanguageSelector';

interface ResponsiveAuthCardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  showBranding?: boolean;
  className?: string;
}

const ResponsiveAuthCard: React.FC<ResponsiveAuthCardProps> = ({
  children,
  title,
  subtitle,
  showBranding = true,
  className = ''
}) => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-pink-50">
      {/* Header */}
      {showBranding && (
        <header className="bg-gradient-to-r from-cyan-400 to-pink-400 text-white px-3 py-3 sm:px-4 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h1 className="text-sm sm:text-lg font-bold">{t('branding.appName')}</h1>
              <LanguageSelector variant="header" />
            </div>
            <Heart className="text-white" size={20} />
          </div>
          <p className="text-xs sm:text-sm mt-1 opacity-90">{t('branding.tagline')}</p>
        </header>
      )}

      {/* Main Content */}
      <div className="px-3 py-6 sm:px-4 sm:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`max-w-sm mx-auto ${className}`}
        >
          {(title || subtitle) && (
            <div className="text-center mb-6 sm:mb-8">
              {title && (
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="text-sm sm:text-base text-gray-600">
                  {subtitle}
                </p>
              )}
            </div>
          )}
          
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
            {children}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ResponsiveAuthCard;