import React, { useEffect, useState } from 'react';
import { Heart, Search } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { useProfile } from '../contexts/ProfileContext';
import Header from '../components/Header';
import ProfileCard from '../components/ProfileCard';
import LoadingState from '../components/LoadingState';
import type { UserProfile } from '../types';

const Favorites: React.FC = () => {
  const { user } = useAuth();
  const { favorites, loading: favoritesLoading } = useFavorites();
  const { getProfile } = useProfile();
  const [favoriteProfiles, setFavoriteProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFavoriteProfiles = async () => {
      if (!user || favorites.length === 0) {
        setFavoriteProfiles([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const profiles = await Promise.all(
          favorites.map(async (profileId) => {
            const profile = await getProfile(profileId);
            return profile;
          })
        );

        setFavoriteProfiles(profiles.filter(Boolean) as UserProfile[]);
      } catch (error) {
        console.error('Error loading favorite profiles:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFavoriteProfiles();
  }, [favorites, getProfile, user]);

  if (!user) {
    return (
      <div className="pb-20 w-full">
        <Header title="My Favorites" showBack={true} gradient={true} />
        <div className="flex flex-col items-center justify-center h-64 px-4">
          <Heart className="w-16 h-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Please Login</h3>
          <p className="text-gray-600 text-center">
            You need to be logged in to view your favorite profiles.
          </p>
        </div>
      </div>
    );
  }

  if (loading || favoritesLoading) {
    return (
      <div className="pb-20 w-full">
        <Header title="My Favorites" showBack={true} gradient={true} />
        <LoadingState message="Loading your favorites..." />
      </div>
    );
  }

  return (
    <div className="pb-20 w-full">
      <Header title="My Favorites" showBack={true} gradient={true} />
      
      <div className="p-3 sm:p-4 md:p-6 lg:p-8">
        {favoriteProfiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <Heart className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Favorites Yet</h3>
            <p className="text-gray-600 text-center mb-6">
              Start exploring profiles and add them to your favorites to see them here.
            </p>
            <button
              onClick={() => window.history.back()}
              className="bg-gradient-to-r from-cyan-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-cyan-600 hover:to-pink-600 transition-all flex items-center"
            >
              <Search className="w-4 h-4 mr-2" />
              Explore Profiles
            </button>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                {favoriteProfiles.length} favorite{favoriteProfiles.length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Grid view for larger screens, list view for mobile */}
            <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-6">
              {favoriteProfiles.map((profile) => {
                const age = profile.dateOfBirth
                  ? Math.floor((Date.now() - new Date(profile.dateOfBirth).getTime()) / (1000 * 60 * 60 * 24 * 365.25))
                  : 0;
                return (
                  <ProfileCard
                    key={profile.id}
                    profile={{
                      id: profile.id,
                      name: profile.fullName || '',
                      age,
                      location: profile.location || '',
                      isOnline: profile.isOnline,
                      photo: profile.photos && profile.photos.length > 0 ? profile.photos[0] : undefined,
                      occupation: profile.occupation
                    }}
                    variant="grid"
                  />
                );
              })}
            </div>

            {/* List view for mobile */}
            <div className="sm:hidden space-y-3">
              {favoriteProfiles.map((profile) => {
                const age = profile.dateOfBirth
                  ? Math.floor((Date.now() - new Date(profile.dateOfBirth).getTime()) / (1000 * 60 * 60 * 24 * 365.25))
                  : 0;
                return (
                  <ProfileCard
                    key={profile.id}
                    profile={{
                      id: profile.id,
                      name: profile.fullName || '',
                      age,
                      location: profile.location || '',
                      isOnline: profile.isOnline,
                      photo: profile.photos && profile.photos.length > 0 ? profile.photos[0] : undefined,
                      occupation: profile.occupation
                    }}
                    variant="list"
                  />
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Favorites;