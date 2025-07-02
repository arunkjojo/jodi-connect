import { createContext, useContext } from 'react';
export interface UserProfile {
  id: string;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  location?: string;
  isOnline?: boolean;
  email?: string;
  phone?: string;
  bio?: string;
  motherTongue?: string;
  height?: number;
  income?: string;
  familyDetails?: string;
  profileCreatedBy?: string;
  genderPreference?: string;
  agePreference?: string;
  state: string;
  district: string;
  city: string;
  aboutMe: string;
  religion: string;
  caste: string;
  maritalStatus: string;
  detailedIntroduction: string;
  photos: string[];
  idVerified: boolean;
  interests: string[];
  occupation: string;
  education: string;
  diet: string;
  smoking: string;
  drinking: string;
  createdAt: Date;
  updatedAt: Date;
  hobies?: string[];
  languages?: string[];
  lookingFor?: string;
}

export interface ProfileContextType {
  profile: UserProfile | null;
  loading: boolean;
  createProfile: (profileData: Partial<UserProfile>) => Promise<boolean>;
  updateProfile: (profileData: Partial<UserProfile>) => Promise<boolean>;
  getProfile: (userId: string) => Promise<UserProfile | null>;
  searchProfiles: (filters: Partial<UserProfile>) => Promise<UserProfile[]>;
}

export const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
