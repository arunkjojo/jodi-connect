import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Heart, X, Users, BookmarkCheck, Eye, CreditCard, Headphones } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../contexts/ProfileContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { profile } = useProfile();

  const phoneNumber = user?.phoneNumber || '+91 9876543210';
  const userName = profile?.fullName || 'Arun';

  return (
    <div className="pb-20 w-full">
      {/* Header */}
      <header className="bg-gradient-to-r from-cyan-400 to-pink-400 text-white px-4 py-6 sm:px-6 md:px-8 rounded-b-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold">Hi, {userName}!</h1>
            <p className="text-xs sm:text-sm opacity-90">{phoneNumber}</p>
          </div>
          <div className="text-right">
            <p className="text-xs sm:text-sm opacity-90">Profile Status:</p>
            <p className="text-xs sm:text-sm font-semibold bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full">
              Complete & Verified
            </p>
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="px-4 py-6 sm:px-6 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-3 sm:p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xl sm:text-2xl font-bold">25</p>
                <p className="text-xs sm:text-sm opacity-90">Accepted</p>
              </div>
              <div className="bg-white/20 p-2 rounded-full">
                <Heart size={20} className="sm:w-6 sm:h-6" />
              </div>
            </div>
            <ChevronRight className="ml-auto mt-2" size={16} />
          </div>
          
          <div className="bg-gradient-to-r from-pink-500 to-red-500 text-white p-3 sm:p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xl sm:text-2xl font-bold">18</p>
                <p className="text-xs sm:text-sm opacity-90">Rejected</p>
              </div>
              <div className="bg-white/20 p-2 rounded-full">
                <X size={20} className="sm:w-6 sm:h-6" />
              </div>
            </div>
            <ChevronRight className="ml-auto mt-2" size={16} />
          </div>
          
          <div className="bg-gradient-to-r from-teal-500 to-green-500 text-white p-3 sm:p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xl sm:text-2xl font-bold">5</p>
                <p className="text-xs sm:text-sm opacity-90">Referrals</p>
              </div>
              <div className="bg-white/20 p-2 rounded-full">
                <Users size={20} className="sm:w-6 sm:h-6" />
              </div>
            </div>
            <ChevronRight className="ml-auto mt-2" size={16} />
          </div>
          
          <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white p-3 sm:p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xl sm:text-2xl font-bold">12</p>
                <p className="text-xs sm:text-sm opacity-90">Saved</p>
              </div>
              <div className="bg-white/20 p-2 rounded-full">
                <BookmarkCheck size={20} className="sm:w-6 sm:h-6" />
              </div>
            </div>
            <ChevronRight className="ml-auto mt-2" size={16} />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <Link
            to="/profile/me"
            className="w-full bg-yellow-400 text-yellow-900 py-3 sm:py-4 rounded-xl font-semibold flex items-center justify-center hover:bg-yellow-500 transition-colors text-sm sm:text-base"
          >
            <Eye className="mr-2" size={18} />
            View My Profile
          </Link>
          
          <button className="w-full bg-cyan-500 text-white py-3 sm:py-4 rounded-xl font-semibold flex items-center justify-center hover:bg-cyan-600 transition-colors text-sm sm:text-base">
            <CreditCard className="mr-2" size={18} />
            Manage Subscription
          </button>
          
          <button className="w-full bg-green-500 text-white py-3 sm:py-4 rounded-xl font-semibold flex items-center justify-center hover:bg-green-600 transition-colors text-sm sm:text-base">
            <Headphones className="mr-2" size={18} />
            Contact Customer Care
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;