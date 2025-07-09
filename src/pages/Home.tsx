import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ConfirmationResult } from 'firebase/auth';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import LanguageSelector from '../components/LanguageSelector';
import NavigationBar from '../components/NavigationBar';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { signInWithPhone, verifyOTP } = useAuth();
  const { t } = useTranslation();
  const [phoneNumber, setPhoneNumber] = useState('+91 ');
  const [referralCode, setReferralCode] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    if (phoneNumber.length < 14) {
      toast.error('Please enter a valid phone number');
      return;
    }

    setLoading(true);
    try {
      const result = await signInWithPhone(phoneNumber);
      if (result) {
        setConfirmationResult(result);
        setShowOTP(true);
        toast.success('OTP sent successfully!');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!confirmationResult || otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const success = await verifyOTP(confirmationResult, otp);
      if (success) {
        navigate('/profile-creation');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-pink-50">
      {/* Header */}
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

      {/* Main Content */}
      <div className="px-3 py-6 sm:px-4 sm:py-8">
        <div className="max-w-sm mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-6 sm:mb-8">
            {t('auth.welcome')}
          </h2>

          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
            {!showOTP ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('auth.phoneNumber')}
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm sm:text-base"
                    placeholder={t('auth.phonePlaceholder')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('auth.referralCode')}
                  </label>
                  <input
                    type="text"
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value)}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm sm:text-base"
                    placeholder={t('auth.referralPlaceholder')}
                  />
                </div>

                <div className="bg-yellow-50 p-3 rounded-lg">
                  <p className="text-sm text-yellow-800 font-medium">JODI2025</p>
                </div>

                <p className="text-xs text-gray-600 text-center leading-relaxed">
                  {t('auth.termsText')}{' '}
                  <Link to="/terms" className="text-cyan-500 hover:underline">
                    {t('auth.termsLink')}
                  </Link>{' '}
                  {t('auth.and')}{' '}
                  <Link to="/privacy" className="text-cyan-500 hover:underline">
                    {t('auth.privacyLink')}
                  </Link>
                  .
                </p>

                <button
                  onClick={handleSendOTP}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-cyan-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:from-cyan-600 hover:to-pink-600 transition-all disabled:opacity-50 text-sm sm:text-base mb-16"
                >
                  {loading ? t('auth.sendingOtp') : t('auth.joinNow')}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {t('auth.verifyPhone')}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {t('auth.otpSent', { phone: phoneNumber })}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('auth.enterOtp')}
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-center text-lg tracking-widest"
                    placeholder={t('auth.otpPlaceholder')}
                    maxLength={6}
                  />
                </div>

                <button
                  onClick={handleVerifyOTP}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-cyan-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:from-cyan-600 hover:to-pink-600 transition-all disabled:opacity-50"
                >
                  {loading ? t('auth.verifying') : t('auth.verifyOtp')}
                </button>

                <button
                  onClick={() => setShowOTP(false)}
                  className="w-full text-cyan-500 py-2 font-medium hover:underline"
                >
                  {t('auth.changePhone')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* reCAPTCHA container */}
      <div id="recaptcha-container"></div>
    </div>
  );
};

export default Home;