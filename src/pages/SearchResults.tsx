import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useProfile } from '../contexts/ProfileContext';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
import ProfileCard from '../components/ProfileCard';

const SearchResults: React.FC = () => {
  const location = useLocation();
  const { searchProfiles } = useProfile();
  const { t } = useTranslation();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const filters = location.state?.filters || {};

  useEffect(() => {
    loadSearchResults();
  }, []);

  const loadSearchResults = async () => {
    try {
      const results = await searchProfiles(filters);
      setProfiles(results);
    } catch (error) {
      console.error('Error loading search results:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mock data for demonstration with enhanced profiles
  const mockProfiles = [
    { 
      id: '1', 
      name: 'Priya Sharma', 
      age: 27, 
      location: 'Mumbai', 
      isOnline: true,
      occupation: 'Software Engineer',
      photo: 'https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    { 
      id: '2', 
      name: 'Rahul Verma', 
      age: 30, 
      location: 'Delhi', 
      isOnline: false,
      occupation: 'Marketing Manager',
      photo: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    { 
      id: '3', 
      name: 'Sneha Kaur', 
      age: 25, 
      location: 'Bengaluru', 
      isOnline: true,
      occupation: 'UI/UX Designer',
      photo: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    { 
      id: '4', 
      name: 'Arjun Reddy', 
      age: 32, 
      location: 'Hyderabad', 
      isOnline: false,
      occupation: 'Data Scientist',
      photo: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    { 
      id: '5', 
      name: 'Meera Patel', 
      age: 29, 
      location: 'Pune', 
      isOnline: true,
      occupation: 'Doctor',
      photo: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    { 
      id: '6', 
      name: 'Sameer Shah', 
      age: 31, 
      location: 'Chennai', 
      isOnline: false,
      occupation: 'Business Analyst',
      photo: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  if (loading) {
    return (
      <div className="pb-20">
        <Header title="Search Results" showBack={true} gradient={true} />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20">
      <Header title="Search Results" showBack={true} gradient={true} />
      
      <div className="p-3 sm:p-4">
        {/* Results count */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Found {mockProfiles.length} profiles matching your criteria
          </p>
        </div>

        {/* Grid view for larger screens, list view for mobile */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockProfiles.map((profile) => (
            <ProfileCard
              key={profile.id}
              profile={profile}
              variant="grid"
            />
          ))}
        </div>

        {/* List view for mobile */}
        <div className="sm:hidden space-y-3">
          {mockProfiles.map((profile) => (
            <ProfileCard
              key={profile.id}
              profile={profile}
              variant="list"
            />
          ))}
        </div>
        
        {mockProfiles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No profiles found matching your criteria.</p>
            <p className="text-sm text-gray-400 mt-2">Try adjusting your filters and search again.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;