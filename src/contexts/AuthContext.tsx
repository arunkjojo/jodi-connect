import { createContext, useContext } from 'react';
import { 
  RecaptchaVerifier, 
  ConfirmationResult,
  User,
} from 'firebase/auth';

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithPhone: (phoneNumber: string) => Promise<ConfirmationResult | null>;
  verifyOTP: (confirmationResult: ConfirmationResult, otp: string) => Promise<boolean>;
  logout: () => Promise<void>;
  recaptchaVerifier: RecaptchaVerifier | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};