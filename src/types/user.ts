export type UserStatus = 'pending' | 'basic' | 'moreDetails' | 'user-photo' | 'user-verification' | 'partial' | 'complete';

export interface User {
  id: string;
  mobileNumber: string;
  token: string;
  status: UserStatus;
  referralCode: string;
  usedReferralCode?: string;
  fullName?: string;
  dateOfBirth?: string;
  gender?: string;
  districtId?: string;
  city?: string;
  aboutMe?: string;
  religion?: string;
  maritalStatus?: string;
  occupation?: string;
  education?: string;
  detailedIntroduction?: string;
  photoUrl?: string;
  verificationDocumentUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProfileFormData {
  // Basic Details
  fullName?: string;
  dateOfBirth?: string;
  gender?: string;
  districtId?: string;
  city?: string;
  aboutMe?: string;
  
  // Additional Details
  religion?: string;
  maritalStatus?: string;
  occupation?: string;
  education?: string;
  detailedIntroduction?: string;
  
  // Files
  profilePhoto?: File;
  verificationDocument?: File;
  
  // Referral
  usedReferralCode?: string;
}

export interface UserStatusResponse {
  status: UserStatus;
  user: User;
  canAccessFeatures: {
    viewProfiles: boolean;
    favoriteUsers: boolean;
    messaging: boolean;
    fullDashboard: boolean;
  };
}