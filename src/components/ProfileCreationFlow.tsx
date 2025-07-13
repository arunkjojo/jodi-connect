import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Upload, Check, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useEnhancedAuth } from '../contexts/EnhancedAuthContext';
import { UserService } from '../services/firebase/userService';
import { ProfileFormData, UserStatus } from '../types';
import LoadingState from './LoadingState';

interface ProfileCreationFlowProps {
  initialStep?: number;
}

const ProfileCreationFlow: React.FC<ProfileCreationFlowProps> = ({ initialStep = 1 }) => {
  const navigate = useNavigate();
  const { user, refreshUser } = useEnhancedAuth();
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [loading, setLoading] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [verificationDoc, setVerificationDoc] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormData>();

  const steps = [
    { number: 1, title: 'Basic Details', status: 'basic' as UserStatus },
    { number: 2, title: 'Additional Details', status: 'moreDetails' as UserStatus },
    { number: 3, title: 'Profile Photo', status: 'user-photo' as UserStatus },
    { number: 4, title: 'Verification', status: 'user-verification' as UserStatus },
    { number: 5, title: 'Complete', status: 'complete' as UserStatus }
  ];

  // Determine initial step based on user status
  useEffect(() => {
    if (user) {
      const statusToStep: Record<UserStatus, number> = {
        'pending': 1,
        'basic': 2,
        'moreDetails': 3,
        'user-photo': 4,
        'user-verification': 5,
        'partial': 5,
        'complete': 5
      };
      setCurrentStep(statusToStep[user.status] || 1);
    }
  }, [user]);

  // Handle photo file selection
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePhoto(file);
      const reader = new FileReader();
      reader.onload = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Handle verification document selection
  const handleVerificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVerificationDoc(file);
    }
  };

  // Submit basic details
  const submitBasicDetails = async (data: ProfileFormData) => {
    if (!user) return;
    
    setLoading(true);
    try {
      await UserService.updateBasicDetails(user.id, {
        fullName: data.fullName,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        districtId: data.districtId,
        city: data.city,
        aboutMe: data.aboutMe
      });
      
      await refreshUser();
      toast.success('Basic details saved!');
      setCurrentStep(2);
    } catch (error) {
      console.error('Error saving basic details:', error);
      toast.error('Failed to save basic details');
    } finally {
      setLoading(false);
    }
  };

  // Submit additional details
  const submitAdditionalDetails = async (data: ProfileFormData) => {
    if (!user) return;
    
    setLoading(true);
    try {
      await UserService.updateAdditionalDetails(user.id, {
        religion: data.religion,
        maritalStatus: data.maritalStatus,
        occupation: data.occupation,
        education: data.education,
        detailedIntroduction: data.detailedIntroduction
      });
      
      await refreshUser();
      toast.success('Additional details saved!');
      setCurrentStep(3);
    } catch (error) {
      console.error('Error saving additional details:', error);
      toast.error('Failed to save additional details');
    } finally {
      setLoading(false);
    }
  };

  // Submit profile photo
  const submitProfilePhoto = async () => {
    if (!user || !profilePhoto) {
      toast.error('Please select a profile photo');
      return;
    }
    
    setLoading(true);
    try {
      await UserService.uploadProfilePhoto(user.id, profilePhoto);
      await refreshUser();
      toast.success('Profile photo uploaded!');
      setCurrentStep(4);
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast.error('Failed to upload photo');
    } finally {
      setLoading(false);
    }
  };

  // Submit verification document
  const submitVerificationDocument = async (data: ProfileFormData) => {
    if (!user || !verificationDoc) {
      toast.error('Please select a verification document');
      return;
    }
    
    setLoading(true);
    try {
      // Upload verification document
      await UserService.uploadVerificationDocument(user.id, verificationDoc);
      
      // Set referral code if provided
      if (data.usedReferralCode) {
        const isValid = await UserService.validateReferralCode(data.usedReferralCode);
        if (isValid) {
          await UserService.setUsedReferralCode(user.id, data.usedReferralCode);
        } else {
          toast.error('Invalid referral code');
          setLoading(false);
          return;
        }
      }
      
      // Check user profile and update final status
      await UserService.checkUserProfile(user.id);
      await refreshUser();
      
      toast.success('Profile completed!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error completing profile:', error);
      toast.error('Failed to complete profile');
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission based on current step
  const onSubmit = (data: ProfileFormData) => {
    switch (currentStep) {
      case 1:
        submitBasicDetails(data);
        break;
      case 2:
        submitAdditionalDetails(data);
        break;
      case 3:
        submitProfilePhoto();
        break;
      case 4:
        submitVerificationDocument(data);
        break;
    }
  };

  if (loading) {
    return <LoadingState message="Saving your information..." fullScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-cyan-400 to-pink-400 text-white px-4 py-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-white/20 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="text-center">
            <h1 className="text-xl font-bold">Complete Your Profile</h1>
            <p className="text-sm opacity-90">Step {currentStep} of {steps.length - 1}</p>
          </div>
          <div className="w-10"></div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white px-4 py-4 shadow-sm">
        <div className="flex items-center justify-between max-w-md mx-auto">
          {steps.slice(0, -1).map((step, index) => (
            <React.Fragment key={step.number}>
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  currentStep > step.number
                    ? 'bg-green-500 text-white'
                    : currentStep === step.number
                    ? 'bg-gradient-to-r from-cyan-500 to-pink-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {currentStep > step.number ? (
                    <Check size={16} />
                  ) : (
                    step.number
                  )}
                </div>
                <span className="text-xs mt-1 text-center text-gray-600 max-w-[60px]">
                  {step.title}
                </span>
              </div>
              
              {index < steps.length - 2 && (
                <div className={`flex-1 h-0.5 mx-2 transition-all ${
                  currentStep > step.number 
                    ? 'bg-green-500' 
                    : 'bg-gray-200'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="px-4 py-6">
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              
              {/* Step 1: Basic Details */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Basic Details</h2>
                    <p className="text-sm text-gray-600 mt-2">Tell us about yourself</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                    <input
                      {...register('fullName', { required: 'Full name is required' })}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      placeholder="Enter your full name"
                      defaultValue={user?.fullName}
                    />
                    {errors.fullName && (
                      <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth *</label>
                    <input
                      {...register('dateOfBirth', { required: 'Date of birth is required' })}
                      type="date"
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      defaultValue={user?.dateOfBirth}
                    />
                    {errors.dateOfBirth && (
                      <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
                    <div className="flex space-x-4">
                      {['Male', 'Female', 'Other'].map((gender) => (
                        <label key={gender} className="flex items-center">
                          <input
                            {...register('gender', { required: 'Please select gender' })}
                            type="radio"
                            value={gender}
                            className="w-4 h-4 text-cyan-500 border-gray-300 focus:ring-cyan-500"
                            defaultChecked={user?.gender === gender}
                          />
                          <span className="ml-2 text-sm text-gray-700">{gender}</span>
                        </label>
                      ))}
                    </div>
                    {errors.gender && (
                      <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">District ID *</label>
                    <input
                      {...register('districtId', { required: 'District ID is required' })}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      placeholder="Enter district ID"
                      defaultValue={user?.districtId}
                    />
                    {errors.districtId && (
                      <p className="text-red-500 text-sm mt-1">{errors.districtId.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                    <input
                      {...register('city', { required: 'City is required' })}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      placeholder="Enter your city"
                      defaultValue={user?.city}
                    />
                    {errors.city && (
                      <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">About Me</label>
                    <textarea
                      {...register('aboutMe')}
                      rows={4}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      placeholder="Tell us about yourself..."
                      defaultValue={user?.aboutMe}
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Additional Details */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Additional Details</h2>
                    <p className="text-sm text-gray-600 mt-2">Help us know you better</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Religion *</label>
                    <select
                      {...register('religion', { required: 'Please select religion' })}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      defaultValue={user?.religion}
                    >
                      <option value="">Select Religion</option>
                      <option value="Hindu">Hindu</option>
                      <option value="Muslim">Muslim</option>
                      <option value="Christian">Christian</option>
                      <option value="Sikh">Sikh</option>
                      <option value="Buddhist">Buddhist</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.religion && (
                      <p className="text-red-500 text-sm mt-1">{errors.religion.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Marital Status *</label>
                    <select
                      {...register('maritalStatus', { required: 'Please select marital status' })}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      defaultValue={user?.maritalStatus}
                    >
                      <option value="">Select Status</option>
                      <option value="Never Married">Never Married</option>
                      <option value="Divorced">Divorced</option>
                      <option value="Widowed">Widowed</option>
                    </select>
                    {errors.maritalStatus && (
                      <p className="text-red-500 text-sm mt-1">{errors.maritalStatus.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Occupation</label>
                    <input
                      {...register('occupation')}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      placeholder="Your occupation"
                      defaultValue={user?.occupation}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Education</label>
                    <input
                      {...register('education')}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      placeholder="Your education"
                      defaultValue={user?.education}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Detailed Introduction</label>
                    <textarea
                      {...register('detailedIntroduction')}
                      rows={4}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      placeholder="Tell us more about yourself, your family, expectations..."
                      defaultValue={user?.detailedIntroduction}
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Profile Photo */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Profile Photo</h2>
                    <p className="text-sm text-gray-600 mt-2">Upload a clear photo of yourself</p>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mb-4 overflow-hidden">
                      {photoPreview || user?.photoUrl ? (
                        <img 
                          src={photoPreview || user?.photoUrl} 
                          alt="Profile preview" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center">
                          <Upload className="mx-auto text-gray-400 mb-2" size={24} />
                          <p className="text-sm text-gray-500">Upload Photo</p>
                        </div>
                      )}
                    </div>
                    
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                      id="profile-photo"
                    />
                    <label
                      htmlFor="profile-photo"
                      className="bg-cyan-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-cyan-600 transition-colors"
                    >
                      Choose Photo
                    </label>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="flex items-start">
                      <AlertCircle className="text-yellow-500 mt-0.5 mr-2" size={16} />
                      <div>
                        <h4 className="text-sm font-medium text-yellow-800">Photo Guidelines</h4>
                        <ul className="text-xs text-yellow-700 mt-1 space-y-1">
                          <li>• Use a clear, recent photo</li>
                          <li>• Face should be clearly visible</li>
                          <li>• Avoid group photos or sunglasses</li>
                          <li>• Professional or casual attire preferred</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Verification */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Verification</h2>
                    <p className="text-sm text-gray-600 mt-2">Upload ID proof and referral code</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Verification Document *</label>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleVerificationChange}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Upload Aadhaar, PAN, Passport, or Driving License
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Referral Code (Optional)</label>
                    <input
                      {...register('usedReferralCode')}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      placeholder="Enter referral code"
                      defaultValue={user?.usedReferralCode}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Enter a referral code from another user to unlock additional features
                    </p>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-start">
                      <AlertCircle className="text-blue-500 mt-0.5 mr-2" size={16} />
                      <div>
                        <h4 className="text-sm font-medium text-blue-800">Privacy Notice</h4>
                        <p className="text-xs text-blue-700 mt-1">
                          Your verification documents are used only for identity verification and are not shared with other users.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex space-x-4 pt-6">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </button>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-cyan-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:from-cyan-600 hover:to-pink-600 transition-all disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              ) : currentStep < 4 ? (
                <>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              ) : (
                'Complete Profile'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileCreationFlow;