import React from 'react';
import { useParams } from 'react-router-dom';
import { Share2, MessageCircle, Flag } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
import FavoriteButton from '../components/FavoriteButton';

const Profile: React.FC = () => {
  const { id } = useParams();
  const { t } = useTranslation();

  // Mock profile data
  const profile = {
    name: 'Ananya',
    age: 28,
    location: 'Bengaluru, Karnataka',
    isOnline: true,
    photos: [
      'https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400',
      'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400'
    ],
    aboutMe: 'Passionate software engineer with a love for travel and South Indian classical music. Looking for a partner who shares my zest for life and cultural roots. Enjoy exploring new cafes and quiet evenings with a good book.',
    interests: ['Reading', 'Classical Dance', 'Photography', 'Travel', 'Cooking Indian Cuisine', 'Yoga'],
    details: {
      occupation: 'Software Engineer at TechCorp',
      education: 'B.Tech, Computer Science',
      diet: 'Vegetarian',
      smoking: 'No',
      drinking: 'Occasionally',
      height: '5\'5"',
      religion: 'Hindu',
      caste: 'Brahmin'
    }
  };

  return (
    <div className="pb-20">
      <Header showBack={true} showMenu={true} />
      
      <div className="px-3 py-4 sm:px-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-cyan-400 to-pink-400 text-white p-4 sm:p-6 rounded-xl">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 rounded-full flex items-center justify-center overflow-hidden">
              <img 
                src={profile.photos[0]} 
                alt="Profile" 
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <h1 className="text-lg sm:text-xl font-bold truncate">{profile.name}, {profile.age}</h1>
                {profile.isOnline && (
                  <div className="w-3 h-3 bg-green-400 rounded-full flex-shrink-0"></div>
                )}
              </div>
              <p className="text-sm opacity-90 truncate">{profile.location}</p>
            </div>
          </div>
          
          <div className="flex space-x-3 mt-4">
            <FavoriteButton 
              profileId={id || '1'} 
              variant="button" 
              className="flex-1 bg-white/20 hover:bg-white/30 text-white border-0"
            />
            <button className="flex-1 bg-white text-cyan-500 px-4 py-2 rounded-lg flex items-center justify-center font-semibold hover:bg-gray-100 transition-colors">
              <MessageCircle className="mr-2" size={18} />
              <span className="text-sm sm:text-base">Connect Now</span>
            </button>
          </div>
        </div>

        {/* About Me */}
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-3 flex items-center text-sm sm:text-base">
            <span className="text-lg mr-2">📝</span>
            {t('profile.aboutMe')}
          </h2>
          <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{profile.aboutMe}</p>
        </div>

        {/* Interests & Hobbies */}
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-3 flex items-center text-sm sm:text-base">
            <span className="text-lg mr-2">🎯</span>
            {t('profile.interests')}
          </h2>
          <div className="flex flex-wrap gap-2">
            {profile.interests.map((interest, index) => (
              <span
                key={index}
                className="bg-gradient-to-r from-cyan-100 to-pink-100 text-gray-700 px-3 py-1 rounded-full text-xs sm:text-sm"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>

        {/* Details & Lifestyle */}
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-3 flex items-center text-sm sm:text-base">
            <span className="text-lg mr-2">📋</span>
            {t('profile.details')}
          </h2>
          <div className="space-y-2">
            {Object.entries(profile.details).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center py-1">
                <span className="text-gray-600 capitalize text-sm sm:text-base">
                  {key.replace(/([A-Z])/g, ' $1').trim()}:
                </span>
                <span className="text-gray-900 font-medium text-sm sm:text-base text-right">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Photo Gallery */}
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-3 flex items-center text-sm sm:text-base">
            <span className="text-lg mr-2">📸</span>
            {t('profile.photos')}
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {profile.photos.map((photo, index) => (
              <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img 
                  src={photo} 
                  alt={`Photo ${index + 1}`} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Report/Share Section */}
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <div className="flex justify-between items-center">
            <button className="flex items-center space-x-2 text-red-500 hover:text-red-600">
              <Flag size={16} />
              <span className="text-xs sm:text-sm">Report or Block User</span>
            </button>
            <div className="flex space-x-3">
              <button className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors">
                <Share2 size={16} />
              </button>
              <button className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors">
                <MessageCircle size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;