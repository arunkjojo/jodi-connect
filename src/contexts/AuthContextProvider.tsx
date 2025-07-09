import React, { useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../services/firebase/config';
import {
  signInWithPhoneNumber,
  RecaptchaVerifier,
  ConfirmationResult,
  User,
  onAuthStateChanged,
  signOut
} from 'firebase/auth';
import toast from 'react-hot-toast';
import { AuthContext } from './AuthContext';
import { AuthContextType } from '../types';
import { useRegistrationStore, useAuthStore } from '../store';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null);
  const { isCompleted, currentStep } = useRegistrationStore();
  const { setUser: setStoreUser, setApplicationStatus } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setStoreUser(user);
      
      // Update application status based on registration progress
      if (user) {
        if (isCompleted) {
          setApplicationStatus('completed');
        } else if (currentStep > 1) {
          setApplicationStatus('pending');
        } else {
          setApplicationStatus('incomplete');
        }
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, [isCompleted, currentStep, setStoreUser, setApplicationStatus]);

  const signInWithPhone = async (phoneNumber: string): Promise<ConfirmationResult | null> => {
    try {
      if (!recaptchaVerifier) {
        const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible',
          callback: () => {
            console.log('reCAPTCHA solved');
          }
        });
        setRecaptchaVerifier(verifier);

        const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, verifier);
        return confirmationResult;
      } else {
        const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
        return confirmationResult;
      }
    } catch (error: unknown) {
      console.error('Error sending OTP:', error);
      toast.error('Failed to send OTP. Please try again.');
      return null;
    }
  };

  const verifyOTP = async (confirmationResult: ConfirmationResult, otp: string): Promise<boolean> => {
    try {
      await confirmationResult.confirm(otp);
      toast.success('Phone number verified successfully!');
      return true;
    } catch (error: unknown) {
      console.error('Error verifying OTP:', error);
      toast.error('Invalid OTP. Please try again.');
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
      toast.success('Logged out successfully');
    } catch (error: unknown) {
      console.error('Error logging out:', error);
      toast.error('Failed to log out');
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    signInWithPhone,
    verifyOTP,
    logout,
    recaptchaVerifier
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};