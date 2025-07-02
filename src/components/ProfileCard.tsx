import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Clock } from 'lucide-react';
import FavoriteButton from './FavoriteButton';
import { useTranslation } from 'react-i18next';

interface ProfileCardProps {
  profile: {
    id: string;
    name: string;
    age: number;
    location: string;
    isOnline?: boolean;
    photo?: string;
    occupation?: string;
  };
  variant?: 'grid' | 'list';
  className?: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  variant = 'grid',
  className = ''
}) => {
  useTranslation();

  if (variant === 'list') {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        className={`bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all ${className}`}
      >
        <Link to={`/profile/${profile.id}`} className="block">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-pink-400 rounded-full flex items-center justify-center">
                {profile.photo ? (
                  <img
                    src={profile.photo}
                    alt={profile.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-white font-semibold text-lg">
                    {profile.name.charAt(0)}
                  </span>
                )}
              </div>
              {profile.isOnline && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 text-base sm:text-lg truncate">
                {profile.name}, {profile.age}
              </h3>
              <div className="flex items-center text-gray-600 text-sm mt-1">
                <MapPin size={14} className="mr-1 flex-shrink-0" />
                <span className="truncate">{profile.location}</span>
              </div>
              {profile.occupation && (
                <p className="text-gray-500 text-sm mt-1 truncate">{profile.occupation}</p>
              )}
            </div>
            
            <div className="flex flex-col items-end space-y-2">
              <FavoriteButton profileId={profile.id} size="sm" />
              {profile.isOnline && (
                <div className="flex items-center text-green-600 text-xs">
                  <Clock size={12} className="mr-1" />
                  <span>Online</span>
                </div>
              )}
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`relative bg-gradient-to-br from-cyan-400 to-pink-400 text-white rounded-xl shadow-lg overflow-hidden ${className}`}
    >
      <Link to={`/profile/${profile.id}`} className="block p-4 h-full">
        <div className="absolute top-3 right-3 z-10">
          <FavoriteButton profileId={profile.id} size="sm" />
        </div>
        
        <div className="flex flex-col h-full">
          <div className="aspect-square bg-white/20 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
            {profile.photo ? (
              <img
                src={profile.photo}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-xl">
                  {profile.name.charAt(0)}
                </span>
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <h3 className="font-semibold text-base sm:text-lg mb-1">
              {profile.name}, {profile.age}
            </h3>
            <div className="flex items-center text-sm opacity-90 mb-2">
              <MapPin size={14} className="mr-1 flex-shrink-0" />
              <span className="truncate">{profile.location}</span>
            </div>
            {profile.occupation && (
              <p className="text-xs opacity-75 truncate">{profile.occupation}</p>
            )}
          </div>
          
          {profile.isOnline && (
            <div className="flex items-center justify-center mt-2 bg-green-500 rounded-full px-2 py-1">
              <div className="w-2 h-2 bg-white rounded-full mr-1"></div>
              <span className="text-xs font-medium">Online</span>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

export default ProfileCard;