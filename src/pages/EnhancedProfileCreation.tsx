import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../contexts/ProfileContext';
import { useRegistrationStore, useAppStore } from '../store';
import { useResponsive } from '../hooks/useResponsive';
import { useUrlParams } from '../hooks/useUrlParams';
import { Calendar, Upload, ChevronDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import ProgressTracker from '../components/ProgressTracker';
import TouchGestures from '../components/TouchGestures';
import LoadingState from '../components/LoadingState';
import ResponsiveContainer from '../components/ResponsiveContainer';
import LanguageSelector from '../components/LanguageSelector';

import { db } from '../services/firebase/config';
import { collection, getDocs } from 'firebase/firestore';

type District = {
  name: string;
  localName?: string;
};

type State = {
  id: number;
  name: string;
  localName: string;
};

const EnhancedProfileCreation: React.FC = () => {
  const navigate = useNavigate();
  const { createProfile } = useProfile();
  const { 
    currentStep, 
    formData, 
    referralCode,
    setCurrentStep, 
    updateFormData, 
    markCompleted,
    saveProgress 
  } = useRegistrationStore();
  const { loading, setLoading, setError } = useAppStore();
  const { isMobile } = useResponsive();
  useUrlParams(); // Auto-populate referral code from URL

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm({
    defaultValues: formData
  });

  const steps = [
    { number: 1, title: 'Basic', icon: '✨' },
    { number: 2, title: 'Photos', icon: '📸' },
    { number: 3, title: 'Details', icon: '🌸' },
    { number: 4, title: 'Verify', icon: '✅' }
  ];

  const selectedState = watch('state');

  const [state, setState] = useState<State[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);

  useEffect(() => {
    const fetchStates = async () => {
      const snapshot = await getDocs(collection(db, 'states'));
      const data = snapshot.docs.map(doc => {
        const d = doc.data();
        return {
          id: d.id,
          name: d.name,
          localName: d.localName,
        } as State;
      });
      setState(data);
    };
    fetchStates();
  }, []);

  useEffect(() => {
    const fetchDistricts = async () => {
      if (!selectedState) return;

      try {
        const stateObj = state.find(loc => loc.name === selectedState);
        if (!stateObj) return;

        const querySnapshot = await getDocs(collection(db, 'districts'));
        const districtList = querySnapshot.docs
          .map((doc) => doc.data())
          .filter((dist) => dist.stateId === stateObj.id)
          .map((dist) => ({
            name: dist.name,
            localName: dist.localName,
          } as District));

        setDistricts(districtList);
      } catch (err) {
        console.error('Error fetching districts:', err);
      }
    };

    fetchDistricts();
  }, [selectedState, state]);

  // Auto-save form data
  useEffect(() => {
    const subscription = watch((value) => {
      updateFormData(value);
    });
    return () => subscription.unsubscribe();
  }, [watch, updateFormData]);

  // Set referral code in form if available
  useEffect(() => {
    if (referralCode) {
      setValue('referralCode', referralCode);
    }
  }, [referralCode, setValue]);

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      saveProgress();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepSubmit = async (data: Record<string, any>) => {
    setError(null);
    updateFormData(data);
    
    if (currentStep === 4) {
      await handleCompleteProfile();
    } else {
      nextStep();
    }
  };

  const handleCompleteProfile = async () => {
    setLoading(true);
    try {
      const success = await createProfile(formData);
      if (success) {
        markCompleted();
        toast.success('Profile created successfully!');
        navigate('/dashboard');
      } else {
        setError('Failed to create profile. Please try again.');
        toast.error('Failed to create profile. Please try again.');
      }
    } catch (error) {
      console.error('Error creating profile:', error);
      setError('An error occurred. Please try again.');
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingState message="Creating your profile..." fullScreen />;
  }

  return (
    <ResponsiveContainer
      className="min-h-screen bg-gray-50"
      mobileClassName="pb-4"
      tabletClassName="pb-6"
      desktopClassName="pb-8"
    >
      {/* Header */}
      <header className="bg-gradient-to-r from-cyan-400 to-pink-400 text-white px-3 py-4 sm:px-4 sm:py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full hover:bg-white/20 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-lg sm:text-xl font-bold">Create Your Profile</h1>
              <p className="text-xs sm:text-sm opacity-90">Step {currentStep} of {steps.length}</p>
            </div>
          </div>
          <LanguageSelector variant="header" />
        </div>
      </header>

      {/* Progress Tracker */}
      <ProgressTracker steps={steps} />

      {/* Form Content */}
      <TouchGestures
        onSwipeLeft={nextStep}
        onSwipeRight={prevStep}
        className="px-3 py-4 sm:px-4 sm:py-6"
      >
        <form onSubmit={handleSubmit(handleStepSubmit)} className="max-w-lg mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="space-y-4 sm:space-y-6"
            >
              
              {/* Step 1: Basic Details */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="text-center mb-6">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center justify-center">
                      <span className="text-2xl mr-2">✨</span>
                      Basic Details
                    </h2>
                    <p className="text-sm text-gray-600 mt-2">Tell us about yourself</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <input
                        {...register('fullName', { required: 'Full name is required' })}
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm sm:text-base"
                        placeholder="Enter your full name"
                      />
                      {errors.fullName?.message && (
                        <p className="text-red-500 text-sm mt-1">{String(errors.fullName.message)}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                      <div className="relative">
                        <input
                          {...register('dateOfBirth', { required: 'Date of birth is required' })}
                          type="date"
                          className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm sm:text-base"
                        />
                        <Calendar className="absolute right-3 top-3 text-gray-400 pointer-events-none" size={20} />
                      </div>
                      {errors.dateOfBirth?.message && (
                        <p className="text-red-500 text-sm mt-1">{String(errors.dateOfBirth.message)}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                        {['Male', 'Female', 'Other'].map((gender) => (
                          <label key={gender} className="flex items-center">
                            <input
                              {...register('gender', { required: 'Please select gender' })}
                              type="radio"
                              value={gender}
                              className="w-4 h-4 text-cyan-500 border-gray-300 focus:ring-cyan-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">{gender}</span>
                          </label>
                        ))}
                      </div>
                      {errors.gender?.message && (
                        <p className="text-red-500 text-sm mt-1">{String(errors.gender.message)}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                      <div className="relative">
                        <select
                          {...register('state', { required: 'Please select state' })}
                          className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent appearance-none text-sm sm:text-base"
                        >
                          <option value="">Select State</option>
                          {state.map((stat) => (
                            <option key={stat.id} value={stat.id}>
                              {stat.name} - {stat.localName}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" size={20} />
                      </div>
                      {errors.state?.message && (
                        <p className="text-red-500 text-sm mt-1">{String(errors.state.message)}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
                      <div className="relative">
                        <select
                          {...register('district', { required: 'Please select district' })}
                          className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent appearance-none text-sm sm:text-base"
                        >
                          <option value="">Select District</option>
                          {districts.map((dist) => (
                            <option key={dist.name} value={dist.name}>
                              {dist.name} - {dist.localName}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" size={20} />
                      </div>
                      {errors.district?.message && (
                        <p className="text-red-500 text-sm mt-1">{String(errors.district.message)}</p>
                      )}
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Current City/Locality</label>
                      <input
                        {...register('city', { required: 'Current city is required' })}
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm sm:text-base"
                        placeholder="e.g., Bengaluru, South Delhi"
                      />
                      {errors.city?.message && (
                        <p className="text-red-500 text-sm mt-1">{String(errors.city.message)}</p>
                      )}
                    </div>

                    {referralCode && (
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Referral Code</label>
                        <input
                          {...register('referralCode')}
                          className="w-full px-3 py-3 border border-gray-300 rounded-lg bg-gray-50 text-sm sm:text-base"
                          readOnly
                        />
                      </div>
                    )}

                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tell Us About Yourself</label>
                      <textarea
                        {...register('aboutMe')}
                        rows={isMobile ? 3 : 4}
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm sm:text-base"
                        placeholder="Share a little about your personality, hobbies, and what makes you, you!"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Photos */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center justify-center">
                      <span className="text-2xl mr-2">📸</span>
                      Your Best Photos
                    </h2>
                    <p className="text-sm text-gray-600 mt-2">Upload 3 clear photos. We'll help you pick your best!</p>
                  </div>

                  <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-3'}`}>
                    {[1, 2, 3].map((num) => (
                      <div key={num} className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-cyan-500 transition-colors cursor-pointer p-4">
                        <Upload className="text-gray-400 mb-2" size={isMobile ? 32 : 24} />
                        <p className="text-sm text-gray-500 text-center">Add Photo {num}</p>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          {...register(`photo${num}`)}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-sm text-yellow-800 mb-2">Photo Guidelines:</h3>
                    <div className="text-xs text-yellow-700 space-y-1">
                      <p><span className="font-medium">✅ Good:</span> Clear, recent, smiling, natural lighting</p>
                      <p><span className="font-medium">❌ Avoid:</span> Blurry, group photos, sunglasses, too far away</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: More Details */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="text-center mb-6">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center justify-center">
                      <span className="text-2xl mr-2">🌸</span>
                      More About You
                    </h2>
                    <p className="text-sm text-gray-600 mt-2">Help us understand you better</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Religion</label>
                      <div className="relative">
                        <select
                          {...register('religion', { required: 'Please select religion' })}
                          className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent appearance-none text-sm sm:text-base"
                        >
                          <option value="">Select Religion</option>
                          <option value="Hindu">Hindu</option>
                          <option value="Muslim">Muslim</option>
                          <option value="Christian">Christian</option>
                          <option value="Sikh">Sikh</option>
                          <option value="Buddhist">Buddhist</option>
                          <option value="Other">Other</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" size={20} />
                      </div>
                      {errors.religion?.message && (
                        <p className="text-red-500 text-sm mt-1">{String(errors.religion.message)}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Marital Status</label>
                      <div className="relative">
                        <select
                          {...register('maritalStatus', { required: 'Please select marital status' })}
                          className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent appearance-none text-sm sm:text-base"
                        >
                          <option value="">Select Status</option>
                          <option value="Never Married">Never Married</option>
                          <option value="Divorced">Divorced</option>
                          <option value="Widowed">Widowed</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" size={20} />
                      </div>
                      {errors.maritalStatus?.message && (
                        <p className="text-red-500 text-sm mt-1">{String(errors.maritalStatus.message)}</p>
                      )}
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Occupation</label>
                      <input
                        {...register('occupation')}
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm sm:text-base"
                        placeholder="e.g., Software Engineer, Doctor, Teacher"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Education</label>
                      <input
                        {...register('education')}
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm sm:text-base"
                        placeholder="e.g., B.Tech, MBA, MBBS"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Detailed Introduction</label>
                      <textarea
                        {...register('detailedIntroduction')}
                        rows={isMobile ? 4 : 5}
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm sm:text-base"
                        placeholder="Describe your background, family values, expectations from a partner, or anything else important."
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Verification */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center justify-center">
                      <span className="text-2xl mr-2">✅</span>
                      Verify Your Identity
                    </h2>
                    <p className="text-sm text-gray-600 mt-2">
                      Gain more trust and visibility by verifying your profile
                    </p>
                  </div>

                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-cyan-500 transition-colors cursor-pointer">
                    <Upload className="mx-auto text-gray-400 mb-4" size={48} />
                    <p className="text-sm text-gray-600">
                      Upload ID Proof<br />
                      (Aadhaar, PAN, Driving License, Passport)
                    </p>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      className="hidden"
                      {...register('idDocument')}
                    />
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-sm text-blue-800 mb-2">Privacy & Security:</h3>
                    <p className="text-xs text-blue-700">
                      Your ID proof is for verification purposes only and will not be shared with other users. 
                      It helps us maintain a secure platform for everyone.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className={`flex gap-3 pt-6 ${isMobile ? 'flex-col' : 'flex-row'}`}>
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className={`${isMobile ? 'w-full' : 'flex-1'} bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center`}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </button>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className={`${isMobile ? 'w-full' : 'flex-1'} bg-gradient-to-r from-cyan-500 to-pink-500 text-white py-3 px-4 rounded-lg font-semibold hover:from-cyan-600 hover:to-pink-600 transition-all disabled:opacity-50 flex items-center justify-center`}
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                />
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

          {/* Swipe Hint for Mobile */}
          {isMobile && (
            <div className="text-center mt-4">
              <p className="text-xs text-gray-500">
                💡 Tip: Swipe left/right to navigate between steps
              </p>
            </div>
          )}
        </form>
      </TouchGestures>
    </ResponsiveContainer>
  );
};

export default EnhancedProfileCreation;