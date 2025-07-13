import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ConfirmationResult } from 'firebase/auth';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { useEnhancedAuth } from '../contexts/EnhancedAuthContext';
import ResponsiveAuthCard from '../components/ResponsiveAuthCard';

const EnhancedLogin: React.FC = () => {
  const navigate = useNavigate();
  const { signInWithPhone, verifyOTP, user } = useEnhancedAuth();
  const { t } = useTranslation();
  const [phoneNumber, setPhoneNumber] = useState('+91 ');
  const [referralCode, setReferralCode] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [loading, setLoading] = useState(false);

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      // Redirect based on user status
      if (user.status === 'pending' || user.status === 'basic' || 
          user.status === 'moreDetails' || user.status === 'user-photo' || 
          user.status === 'user-verification') {
        navigate('/profile-creation');
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, navigate]);

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
        // Navigation will be handled by the useEffect above
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ResponsiveAuthCard
      title={showOTP ? t('auth.verifyPhone') : t('auth.welcome')}
      subtitle={showOTP ? t('auth.otpSent', { phone: phoneNumber }) : undefined}
    >
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

          <button
            onClick={handleSendOTP}
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:from-cyan-600 hover:to-pink-600 transition-all disabled:opacity-50 text-sm sm:text-base"
          >
            {loading ? t('auth.sendingOtp') : t('auth.joinNow')}
          </button>

          <p className="text-xs text-gray-600 text-center leading-relaxed">
            {t('auth.termsText')}{' '}
            <a href="/terms" className="text-cyan-500 hover:underline">
              {t('auth.termsLink')}
            </a>{' '}
            {t('auth.and')}{' '}
            <a href="/privacy" className="text-cyan-500 hover:underline">
              {t('auth.privacyLink')}
            </a>
            .
          </p>
        </div>
      ) : (
        <div className="space-y-4">
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

      {/* reCAPTCHA container */}
      <div id="recaptcha-container"></div>
    </ResponsiveAuthCard>
  );
};

export default EnhancedLogin;