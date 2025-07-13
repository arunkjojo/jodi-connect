import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  Camera, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  Users, 
  Heart, 
  Search,
  Gift,
  Crown
} from 'lucide-react';
import { useEnhancedAuth } from '../contexts/EnhancedAuthContext';
import { UserService } from '../services/firebase/userService';
import { UserStatusResponse, UserStatus } from '../types';
import LoadingState from '../components/LoadingState';
import Header from '../components/Header';

const EnhancedDashboard: React.FC = () => {
  const { user } = useEnhancedAuth();
  const navigate = useNavigate();
  const [statusData, setStatusData] = useState<UserStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserStatus = async () => {
      if (!user) return;
      
      try {
        const response = await UserService.checkUserStatus(user.id);
        setStatusData(response);
      } catch (error) {
        console.error('Error checking user status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUserStatus();
  }, [user]);

  const getStatusInfo = (status: UserStatus) => {
    switch (status) {
      case 'pending':
        return {
          title: 'Welcome to JodiConnect!',
          description: 'Complete your profile to start finding matches',
          color: 'bg-blue-500',
          icon: User,
          progress: 0
        };
      case 'basic':
        return {
          title: 'Basic Details Added',
          description: 'Add more details to improve your profile',
          color: 'bg-yellow-500',
          icon: FileText,
          progress: 25
        };
      case 'moreDetails':
        return {
          title: 'Profile Details Complete',
          description: 'Upload your photo to make your profile attractive',
          color: 'bg-orange-500',
          icon: Camera,
          progress: 50
        };
      case 'user-photo':
        return {
          title: 'Photo Uploaded',
          description: 'Complete verification to unlock all features',
          color: 'bg-purple-500',
          icon: CheckCircle,
          progress: 75
        };
      case 'user-verification':
        return {
          title: 'Verification Complete',
          description: 'Your profile is being reviewed',
          color: 'bg-indigo-500',
          icon: CheckCircle,
          progress: 90
        };
      case 'partial':
        return {
          title: 'Profile Almost Complete',
          description: 'Get a valid referral to unlock premium features',
          color: 'bg-amber-500',
          icon: AlertTriangle,
          progress: 95
        };
      case 'complete':
        return {
          title: 'Profile Complete!',
          description: 'Welcome to the full JodiConnect experience',
          color: 'bg-green-500',
          icon: Crown,
          progress: 100
        };
      default:
        return {
          title: 'Getting Started',
          description: 'Complete your profile setup',
          color: 'bg-gray-500',
          icon: User,
          progress: 0
        };
    }
  };

  if (loading) {
    return <LoadingState message="Loading your dashboard..." fullScreen />;
  }

  if (!user || !statusData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Dashboard</h2>
          <p className="text-gray-600 mb-4">Please try refreshing the page</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-cyan-500 text-white px-4 py-2 rounded-lg hover:bg-cyan-600 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(statusData.status);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="pb-20 w-full min-h-screen bg-gray-50">
      <Header 
        title="Dashboard" 
        subtitle={`Welcome back, ${user.fullName || 'User'}!`}
        gradient={true}
      />

      <div className="px-4 py-6 space-y-6">
        {/* Status Card */}
        <div className={`${statusInfo.color} text-white p-6 rounded-xl shadow-lg`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <StatusIcon className="w-8 h-8 mr-3" />
              <div>
                <h2 className="text-xl font-bold">{statusInfo.title}</h2>
                <p className="text-sm opacity-90">{statusInfo.description}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{statusInfo.progress}%</div>
              <div className="text-xs opacity-75">Complete</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-500"
              style={{ width: `${statusInfo.progress}%` }}
            />
          </div>
        </div>

        {/* Action Cards Based on Status */}
        {statusData.status === 'pending' && (
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Get Started</h3>
            <p className="text-gray-600 mb-4">
              Complete your profile to start connecting with potential matches.
            </p>
            <button
              onClick={() => navigate('/profile-creation')}
              className="w-full bg-gradient-to-r from-cyan-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:from-cyan-600 hover:to-pink-600 transition-all"
            >
              Start Profile Creation
            </button>
          </div>
        )}

        {(statusData.status === 'basic' || statusData.status === 'moreDetails' || 
          statusData.status === 'user-photo' || statusData.status === 'user-verification') && (
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Continue Profile Setup</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className={`w-5 h-5 mr-3 ${user.fullName ? 'text-green-500' : 'text-gray-400'}`} />
                  <span className="text-sm">Basic Details</span>
                </div>
                {user.fullName && <span className="text-xs text-green-600 font-medium">Complete</span>}
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className={`w-5 h-5 mr-3 ${user.religion ? 'text-green-500' : 'text-gray-400'}`} />
                  <span className="text-sm">Additional Details</span>
                </div>
                {user.religion && <span className="text-xs text-green-600 font-medium">Complete</span>}
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className={`w-5 h-5 mr-3 ${user.photoUrl ? 'text-green-500' : 'text-gray-400'}`} />
                  <span className="text-sm">Profile Photo</span>
                </div>
                {user.photoUrl && <span className="text-xs text-green-600 font-medium">Complete</span>}
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className={`w-5 h-5 mr-3 ${user.verificationDocumentUrl ? 'text-green-500' : 'text-gray-400'}`} />
                  <span className="text-sm">Verification</span>
                </div>
                {user.verificationDocumentUrl && <span className="text-xs text-green-600 font-medium">Complete</span>}
              </div>
            </div>
            
            <button
              onClick={() => navigate('/profile-creation')}
              className="w-full mt-4 bg-gradient-to-r from-cyan-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:from-cyan-600 hover:to-pink-600 transition-all"
            >
              Continue Setup
            </button>
          </div>
        )}

        {statusData.status === 'partial' && (
          <div className="bg-amber-50 border border-amber-200 p-6 rounded-xl">
            <div className="flex items-start">
              <Gift className="w-6 h-6 text-amber-500 mt-1 mr-3" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-amber-900 mb-2">Unlock Premium Features</h3>
                <p className="text-amber-800 mb-4">
                  Your profile is almost complete! Get a valid referral from a female user who has completed her profile to unlock all premium features.
                </p>
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Your Referral Code:</h4>
                  <div className="flex items-center justify-between bg-gray-100 p-3 rounded-lg">
                    <code className="text-lg font-bold text-cyan-600">{user.referralCode}</code>
                    <button
                      onClick={() => navigator.clipboard.writeText(user.referralCode)}
                      className="text-sm bg-cyan-500 text-white px-3 py-1 rounded hover:bg-cyan-600 transition-colors"
                    >
                      Copy
                    </button>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    Share this code with others to help them complete their profiles
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Feature Access Cards */}
        {statusData.status === 'complete' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              to="/search"
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center mb-3">
                <Search className="w-6 h-6 text-cyan-500 mr-3" />
                <h3 className="font-semibold text-gray-900">Find Matches</h3>
              </div>
              <p className="text-sm text-gray-600">
                Search and discover compatible profiles
              </p>
            </Link>

            <Link
              to="/favorites"
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center mb-3">
                <Heart className="w-6 h-6 text-red-500 mr-3" />
                <h3 className="font-semibold text-gray-900">My Favorites</h3>
              </div>
              <p className="text-sm text-gray-600">
                View your saved profiles
              </p>
            </Link>
          </div>
        )}

        {/* Limited Access Message */}
        {!statusData.canAccessFeatures.fullDashboard && statusData.status !== 'complete' && (
          <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl">
            <div className="flex items-start">
              <AlertTriangle className="w-6 h-6 text-blue-500 mt-1 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Limited Access</h3>
                <p className="text-blue-800 mb-4">
                  Complete your profile to unlock all features including profile browsing, favorites, and messaging.
                </p>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• View other user profiles</li>
                  <li>• Add users to favorites</li>
                  <li>• Send and receive messages</li>
                  <li>• Advanced search filters</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* User Info Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Mobile Number:</span>
              <span className="font-medium">{user.mobileNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className={`font-medium capitalize ${
                statusData.status === 'complete' ? 'text-green-600' : 
                statusData.status === 'partial' ? 'text-amber-600' : 'text-blue-600'
              }`}>
                {statusData.status}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Referral Code:</span>
              <span className="font-medium font-mono">{user.referralCode}</span>
            </div>
            {user.usedReferralCode && (
              <div className="flex justify-between">
                <span className="text-gray-600">Used Referral:</span>
                <span className="font-medium font-mono">{user.usedReferralCode}</span>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        {statusData.status === 'complete' && (
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl shadow-sm text-center">
              <Users className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">0</div>
              <div className="text-xs text-gray-600">Profile Views</div>
            </div>
            
            <div className="bg-white p-4 rounded-xl shadow-sm text-center">
              <Heart className="w-6 h-6 text-red-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">0</div>
              <div className="text-xs text-gray-600">Favorites</div>
            </div>
            
            <div className="bg-white p-4 rounded-xl shadow-sm text-center">
              <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">100%</div>
              <div className="text-xs text-gray-600">Complete</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedDashboard;