import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useProfile, UserProfile } from '../contexts/ProfileContext';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
import ProfileCard from '../components/ProfileCard';

const SearchResults: React.FC = () => {
  const location = useLocation();
  const { searchProfiles } = useProfile();
  useTranslation();
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const filters = React.useMemo(() => location.state?.filters || {}, [location.state]);

  // Mock data for demonstration with enhanced profiles
  const mockProfiles: UserProfile[] = React.useMemo(() => [
    {
      id: '1',
      fullName: 'Priya Sharma',
      dateOfBirth: '1997-01-01',
      gender: 'Female',
      location: 'Mumbai',
      state: 'Maharashtra',
      isOnline: true,
      occupation: 'Software Engineer',
      email: 'priya.sharma@example.com',
      phone: '9876543210',
      bio: 'Passionate about technology and art.',
      interests: ['Coding', 'Art', 'Travel'],
      religion: 'Hindu',
      caste: 'Brahmin',
      motherTongue: 'Hindi',
      education: 'B.Tech',
      height: 165,
      maritalStatus: 'Single',
      income: '10-15 LPA',
      familyDetails: 'Nuclear family',
      hobies: ['Painting', 'Reading'],
      photos: ['https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?auto=compress&cs=tinysrgb&w=400'],
      profileCreatedBy: 'Self',
      district: '',
      city: '',
      aboutMe: '',
      detailedIntroduction: '',
      idVerified: false,
      diet: '',
      smoking: '',
      drinking: '',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      fullName: 'Rahul Verma',
      dateOfBirth: '1994-02-15',
      gender: 'Male',
      location: 'Delhi',
      state: 'Delhi',
      isOnline: false,
      occupation: 'Marketing Manager',
      email: 'rahul.verma@example.com',
      phone: '9876543211',
      bio: 'Love connecting with people.',
      interests: ['Marketing', 'Music', 'Travel'],
      religion: 'Hindu',
      caste: 'Kshatriya',
      motherTongue: 'Hindi',
      education: 'MBA',
      height: 175,
      maritalStatus: 'Single',
      income: '15-20 LPA',
      familyDetails: 'Joint family',
      hobies: ['Music', 'Football'],
      photos: ['https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400'],
      profileCreatedBy: 'Self',
      district: '',
      city: '',
      aboutMe: '',
      detailedIntroduction: '',
      idVerified: false,
      diet: '',
      smoking: '',
      drinking: '',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '3',
      fullName: 'Sneha Kaur',
      gender: 'Female',
      location: 'Bengaluru',
      state: 'Karnataka',
      isOnline: true,
      occupation: 'UI/UX Designer',
      email: 'sneha.kaur@example.com',
      phone: '9876543212',
      bio: 'Design is my passion.',
      interests: ['Design', 'Photography'],
      religion: 'Sikh',
      caste: 'Kaur',
      motherTongue: 'Punjabi',
      education: 'B.Des',
      height: 160,
      maritalStatus: 'Single',
      income: '8-12 LPA',
      familyDetails: 'Nuclear family',
      hobies: ['Photography', 'Travel'],
      photos: ['https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400'],
      profileCreatedBy: 'Self',
      dateOfBirth: '',
      district: '',
      city: '',
      aboutMe: '',
      detailedIntroduction: '',
      idVerified: false,
      diet: '',
      smoking: '',
      drinking: '',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '4',
      fullName: 'Arjun Reddy',
      location: 'Hyderabad',
      state: 'Telangana',
      isOnline: false,
      occupation: 'Data Scientist',
      email: 'arjun.reddy@example.com',
      phone: '9876543213',
      bio: 'Data is the new oil.',
      interests: ['Data Science', 'Cricket'],
      religion: 'Hindu',
      caste: 'Reddy',
      motherTongue: 'Telugu',
      education: 'M.Tech',
      height: 180,
      maritalStatus: 'Single',
      income: '20-25 LPA',
      familyDetails: 'Joint family',
      hobies: ['Cricket', 'Chess'],
      photos: ['https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400'],
      profileCreatedBy: 'Self',
      dateOfBirth: '',
      gender: '',
      district: '',
      city: '',
      aboutMe: '',
      detailedIntroduction: '',
      idVerified: false,
      diet: '',
      smoking: '',
      drinking: '',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '5',
      fullName: 'Meera Patel',
      dateOfBirth: '1995-05-05',
      state: 'Maharashtra',
      isOnline: true,
      occupation: 'Doctor',
      phone: '9876543214',
      bio: 'Caring for people is my calling.',
      interests: ['Medicine', 'Yoga'],
      religion: 'Hindu',
      caste: 'Patel',
      motherTongue: 'Gujarati',
      education: 'MBBS',
      height: 158,
      maritalStatus: 'Single',
      income: '12-18 LPA',
      familyDetails: 'Nuclear family',
      hobies: ['Yoga', 'Reading'],
      photos: ['https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400'],
      profileCreatedBy: 'Self',
      gender: '',
      district: '',
      city: '',
      aboutMe: '',
      detailedIntroduction: '',
      idVerified: false,
      diet: '',
      smoking: '',
      drinking: '',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '6',
      fullName: 'Sameer Shah',
      dateOfBirth: '1993-06-12',
      gender: 'Male',
      isOnline: false,
      occupation: 'Business Analyst',
      bio: 'Business is in my blood.',
      interests: ['Business', 'Travel'],
      religion: 'Jain',
      caste: 'Shah',
      motherTongue: 'Gujarati',
      education: 'MBA',
      height: 170,
      maritalStatus: 'Single',
      income: '18-22 LPA',
      familyDetails: 'Joint family',
      hobies: ['Travel', 'Music'],
      photos: ['https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400'],
      profileCreatedBy: 'Self',
      state: '',
      district: '',
      city: '',
      aboutMe: '',
      detailedIntroduction: '',
      idVerified: false,
      diet: '',
      smoking: '',
      drinking: '',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ], []);

  useEffect(() => {

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
    loadSearchResults();
    setProfiles(mockProfiles); // Set mock data for demonstration
  }, [filters, mockProfiles, searchProfiles]);

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
    <div className="pb-20 w-full">
      <Header title="Search Results" showBack={true} gradient={true} />
      
      <div className="p-3 sm:p-4 md:p-6 lg:p-8">
        {/* Results count */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Found {mockProfiles.length} profiles matching your criteria
          </p>
        </div>

        {/* Grid view for larger screens, list view for mobile */}
        <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-6">
          {profiles.map((profile) => {
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
          {profiles.map((profile) => {
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