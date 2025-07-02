import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../contexts/ProfileContext';
import { Calendar, Upload, ChevronDown } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const ProfileCreation: React.FC = () => {
  const navigate = useNavigate();
  const { createProfile } = useProfile();
  const [currentStep, setCurrentStep] = useState(1);
  const [profileData, setProfileData] = useState<Record<string, unknown>>({});
  const { register, handleSubmit, formState: { errors } } = useForm();

  const steps = [
    { number: 1, title: 'Basic Details', icon: '✨' },
    { number: 2, title: 'Your Best Photos', icon: '📸' },
    { number: 3, title: 'More About You', icon: '🌸' },
    { number: 4, title: 'Verify Your Identity', icon: '✅' }
  ];

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepSubmit = (data: Record<string, unknown>) => {
    setProfileData({ ...profileData, ...data });
    if (currentStep === 4) {
      handleCompleteProfile();
    } else {
      nextStep();
    }
  };

  const handleCompleteProfile = async () => {
    try {
      const success = await createProfile(profileData);
      if (success) {
        toast.success('Profile created successfully!');
        navigate('/dashboard');
      } else {
        toast.error('Failed to create profile. Please try again.');
      }
    } catch (error) {
      console.error('Error creating profile:', error);
      toast.error('An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-cyan-400 to-pink-400 text-white px-4 py-6">
        <h1 className="text-xl font-bold">Create Your Profile</h1>
        <p className="text-sm opacity-90">Let's build your perfect Jodi profile!</p>
      </header>

      {/* Progress Bar */}
      <div className="bg-white px-4 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          {steps.map((step) => (
            <div key={step.number} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                currentStep >= step.number
                  ? 'bg-gradient-to-r from-cyan-500 to-pink-500 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}>
                {step.number}
              </div>
              {step.number < 4 && (
                <div className={`w-8 h-0.5 mx-2 ${
                  currentStep > step.number ? 'bg-gradient-to-r from-cyan-500 to-pink-500' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="px-4 py-6">
        <form onSubmit={handleSubmit(handleStepSubmit)} className="max-w-sm mx-auto space-y-6">
          
          {/* Step 1: Basic Details */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center justify-center">
                  <span className="text-2xl mr-2">✨</span>
                  Basic Details
                </h2>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  {...register('fullName', { required: 'Full name is required' })}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
                {typeof errors.fullName?.message === 'string' && (
                  <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                <div className="relative">
                  <input
                    {...register('dateOfBirth', { required: 'Date of birth is required' })}
                    type="date"
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                  <Calendar className="absolute right-3 top-3 text-gray-400" size={20} />
                </div>
                {typeof errors.dateOfBirth?.message === 'string' && (
                  <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <div className="flex space-x-4">
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
                {typeof errors.gender?.message === 'string' && (
                  <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                <div className="relative">
                  <select
                    {...register('state', { required: 'Please select state' })}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent appearance-none"
                  >
                    <option value="">Select State</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Gujarat">Gujarat</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-3 text-gray-400" size={20} />
                </div>
                {typeof errors.state?.message === "string" && <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
                <div className="relative">
                  <select
                    {...register('district', { required: 'Please select district' })}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent appearance-none"
                  >
                    <option value="">Select District</option>
                    <option value="Bengaluru">Bengaluru</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Chennai">Chennai</option>
                    <option value="New Delhi">New Delhi</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-3 text-gray-400" size={20} />
                </div>
                {typeof errors.district?.message === "string" && <p className="text-red-500 text-sm mt-1">{errors.district.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current City/Locality</label>
                <input
                  {...register('city', { required: 'Current city is required' })}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="e.g., Bengaluru, South Delhi"
                />
                {typeof errors.city?.message === "string" && <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tell Us About Yourself</label>
                <textarea
                  {...register('aboutMe')}
                  rows={4}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="Share a little about your personality, hobbies, and what makes you, you!"
                />
              </div>
            </div>
          )}

          {/* Step 2: Photos */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center justify-center">
                  <span className="text-2xl mr-2">📸</span>
                  Your Best Photos
                </h2>
                <p className="text-sm text-gray-600 mt-2">Upload 3 clear photos. We'll help you pick your best!</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3].map((num) => (
                  <div key={num} className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-cyan-500 transition-colors cursor-pointer">
                    <Upload className="text-gray-400 mb-2" size={24} />
                    <p className="text-xs text-gray-500">Add Photo {num}</p>
                  </div>
                ))}
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-semibold text-sm text-yellow-800 mb-2">Sample Photos Guidance:</h3>
                <p className="text-xs text-yellow-700">
                  <span className="font-medium">Good:</span> Clear, recent, smiling, natural.<br />
                  <span className="font-medium">Bad:</span> Blurry, group photos, too far away.
                </p>
              </div>

              <button
                type="button"
                className="w-full text-cyan-500 py-2 font-medium hover:underline"
              >
                View Sample Photos
              </button>
            </div>
          )}

          {/* Step 3: More About You */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center justify-center">
                  <span className="text-2xl mr-2">🌸</span>
                  More About You
                </h2>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Religion</label>
                <div className="relative">
                  <select
                    {...register('religion', { required: 'Please select religion' })}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent appearance-none"
                  >
                    <option value="">Select Religion</option>
                    <option value="Hindu">Hindu</option>
                    <option value="Muslim">Muslim</option>
                    <option value="Christian">Christian</option>
                    <option value="Sikh">Sikh</option>
                    <option value="Buddhist">Buddhist</option>
                    <option value="Other">Other</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-3 text-gray-400" size={20} />
                </div>
                {typeof errors.religion?.message === "string" && <p className="text-red-500 text-sm mt-1">{errors.religion.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Caste / Community</label>
                <div className="relative">
                  <select
                    {...register('caste')}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent appearance-none"
                  >
                    <option value="">Select Caste / Community</option>
                    <option value="Brahmin">Brahmin</option>
                    <option value="Kshatriya">Kshatriya</option>
                    <option value="Vaishya">Vaishya</option>
                    <option value="Other">Other</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-3 text-gray-400" size={20} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Marital Status</label>
                <div className="relative">
                  <select
                    {...register('maritalStatus', { required: 'Please select marital status' })}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent appearance-none"
                  >
                    <option value="">Select Status</option>
                    <option value="Never Married">Never Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-3 text-gray-400" size={20} />
                </div>
                {typeof errors.maritalStatus?.message === "string" && <p className="text-red-500 text-sm mt-1">{errors.maritalStatus.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">A Detailed Introduction</label>
                <textarea
                  {...register('detailedIntroduction')}
                  rows={4}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="Describe your background, family values, expectations from a partner, or anything else important."
                />
              </div>
            </div>
          )}

          {/* Step 4: Verify Identity */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center justify-center">
                  <span className="text-2xl mr-2">✅</span>
                  Verify Your Identity
                </h2>
                <p className="text-sm text-gray-600 mt-2">
                  Gain more trust and visibility by verifying your profile. This helps ensure a safe and genuine community.
                </p>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-cyan-500 transition-colors cursor-pointer">
                <Upload className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-sm text-gray-600">
                  Upload ID Proof<br />
                  (Aadhaar, PAN, Driving License, Passport)
                </p>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-semibold text-sm text-yellow-800 mb-2">Your Privacy Matters:</h3>
                <p className="text-xs text-yellow-700">
                  Your ID proof is for verification purposes only and will not be shared with other users. 
                  It helps us maintain a secure platform.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex space-x-4 pt-6">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Back
              </button>
            )}
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-cyan-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:from-cyan-600 hover:to-pink-600 transition-all"
            >
              {currentStep === 4 ? 'Complete Profile' : 'Next'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileCreation;