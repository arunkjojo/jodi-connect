import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useRegistrationStore } from '../store';

export const useUrlParams = () => {
  const location = useLocation();
  const { setReferralCode } = useRegistrationStore();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const referralCode = searchParams.get('ref') || searchParams.get('referral');
    
    if (referralCode) {
      setReferralCode(referralCode);
    }
  }, [location.search, setReferralCode]);

  const getParam = (key: string): string | null => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get(key);
  };

  return { getParam };
};