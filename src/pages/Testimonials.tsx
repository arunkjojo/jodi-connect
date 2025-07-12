import React from 'react';
import { Quote } from 'lucide-react';
import LanguageSelector from '../components/LanguageSelector';
import { useTranslation } from 'react-i18next';
import NavigationBar from '../components/NavigationBar';

const Testimonials: React.FC = () => {
  const testimonials = [
    {
      id: 1,
      quote: "Found my soulmate on JodiConnect!",
      author: "@PriyaSharma",
      source: "Instagram Comment Screenshot",
      color: "from-yellow-400 to-orange-400"
    },
    {
      id: 2,
      quote: "Truly the best for matrimonial connections!",
      author: "Rahul G.",
      source: "WhatsApp Chat Screenshot",
      color: "from-cyan-400 to-blue-400"
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
          <h1 className="text-lg font-bold">Success Stories</h1>
          <div className="w-8"></div>
        </div>
        <p className="text-sm mt-1 opacity-90 text-center">Success Stories from Our Community!</p>
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
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className={`bg-gradient-to-r ${testimonial.color} text-white p-4 sm:p-6 rounded-xl shadow-lg`}>
              <Quote className="mb-4 opacity-80" size={32} />
              <blockquote className="text-sm sm:text-lg font-semibold mb-4">
                "{testimonial.quote}"
              </blockquote>
              <div className="bg-white/20 p-2 sm:p-4 rounded-lg">
                <p className="text-center font-medium text-xs sm:text-sm">{testimonial.source}</p>
                <p className="text-center text-xs opacity-90">{testimonial.author}</p>
              </div>
              <p className="text-xs text-center mt-2 opacity-75">
                Source: {testimonial.source.includes('Instagram') ? 'Instagram' : 'WhatsApp'}, {testimonial.author}
              </p>
            </div>
          ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;