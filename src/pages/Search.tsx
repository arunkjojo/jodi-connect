import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, ArrowLeft, RotateCcw } from 'lucide-react';
import Header from '../components/Header';

const Search: React.FC = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    quickSearch: '',
    ageRange: [21, 42],
    locationRadius: 50,
    specificCity: '',
    religion: '',
    caste: '',
    motherTongue: '',
    maritalStatus: '',
    dietaryPreferences: [],
    smokingHabits: [],
    drinkingHabits: [],
    relationshipGoals: [],
    interests: []
  });

  const handleApplyFilters = () => {
    navigate('/search-results', { state: { filters } });
  };

  const handleResetFilters = () => {
    setFilters({
      quickSearch: '',
      ageRange: [21, 42],
      locationRadius: 50,
      specificCity: '',
      religion: '',
      caste: '',
      motherTongue: '',
      maritalStatus: '',
      dietaryPreferences: [],
      smokingHabits: [],
      drinkingHabits: [],
      relationshipGoals: [],
      interests: []
    });
  };

  const tags = {
    dietary: ['Vegetarian', 'Non-Vegetarian', 'Eggetarian'],
    smoking: ['Non-Smoker', 'Occasional', 'Smoker'],
    drinking: ['Non-Drinker', 'Social Drinker', 'Drinker'],
    relationship: ['Marriage', 'Long-Term Relationship', 'Casual Dating', 'Friendship'],
    interests: ['Reading', 'Travel', 'Movies', 'Music', 'Foodie', 'Sports', 'Art', 'Cooking', 'Yoga', 'Meditation', 'Tech & Gadgets', 'Outdoors']
  };

  const toggleTag = (category: string, tag: string) => {
    setFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(tag)
        ? prev[category].filter(t => t !== tag)
        : [...prev[category], tag]
    }));
  };

  return (
    <div className="pb-20">
      <Header 
        title="Search & Filter" 
        subtitle="Find Your Ideal Match!" 
        showBack={true}
        gradient={true}
      />

      <div className="p-4 space-y-6">
        {/* Quick Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Quick Search</label>
          <div className="relative">
            <SearchIcon className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              value={filters.quickSearch}
              onChange={(e) => setFilters(prev => ({ ...prev, quickSearch: e.target.value }))}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              placeholder="e.g., Priya Sharma, Doctor"
            />
          </div>
        </div>

        {/* Basic Filters */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
            Basic Filters 🏠
          </h3>
          
          <div className="space-y-4">
            {/* Age Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Age Range</label>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="18"
                  max="60"
                  value={filters.ageRange[0]}
                  onChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    ageRange: [parseInt(e.target.value), prev.ageRange[1]] 
                  }))}
                  className="flex-1"
                />
                <span className="text-sm text-gray-600">{filters.ageRange[0]} - {filters.ageRange[1]}</span>
              </div>
            </div>

            {/* Location Radius */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location Radius (KM)</label>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="10"
                  max="500"
                  value={filters.locationRadius}
                  onChange={(e) => setFilters(prev => ({ ...prev, locationRadius: parseInt(e.target.value) }))}
                  className="flex-1"
                />
                <span className="text-sm text-gray-600">{filters.locationRadius} km</span>
              </div>
            </div>

            {/* Specific City */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Specific City</label>
              <input
                type="text"
                value={filters.specificCity}
                onChange={(e) => setFilters(prev => ({ ...prev, specificCity: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="e.g., Mumbai, Chennai"
              />
            </div>
          </div>
        </div>

        {/* Community & Values */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
            Community & Values 🕉️
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Religion</label>
              <select
                value={filters.religion}
                onChange={(e) => setFilters(prev => ({ ...prev, religion: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                <option value="">Select Religion</option>
                <option value="Hindu">Hindu</option>
                <option value="Muslim">Muslim</option>
                <option value="Christian">Christian</option>
                <option value="Sikh">Sikh</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Caste / Community</label>
              <select
                value={filters.caste}
                onChange={(e) => setFilters(prev => ({ ...prev, caste: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                <option value="">Select Caste / Community</option>
                <option value="Brahmin">Brahmin</option>
                <option value="Kshatriya">Kshatriya</option>
                <option value="Vaishya">Vaishya</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mother Tongue</label>
              <select
                value={filters.motherTongue}
                onChange={(e) => setFilters(prev => ({ ...prev, motherTongue: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                <option value="">Select Mother Tongue</option>
                <option value="Hindi">Hindi</option>
                <option value="English">English</option>
                <option value="Tamil">Tamil</option>
                <option value="Telugu">Telugu</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Marital Status</label>
              <select
                value={filters.maritalStatus}
                onChange={(e) => setFilters(prev => ({ ...prev, maritalStatus: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                <option value="">Select Status</option>
                <option value="Never Married">Never Married</option>
                <option value="Divorced">Divorced</option>
                <option value="Widowed">Widowed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lifestyle & Preferences */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
            Lifestyle & Preferences 🍃
          </h3>
          
          <div className="space-y-4">
            {/* Dietary Preferences */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Dietary Preferences</label>
              <div className="flex flex-wrap gap-2">
                {tags.dietary.map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag('dietaryPreferences', tag)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      filters.dietaryPreferences.includes(tag)
                        ? 'bg-yellow-400 text-yellow-900'
                        : 'bg-white border border-gray-300 text-gray-700'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Smoking Habits */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Smoking Habits</label>
              <div className="flex flex-wrap gap-2">
                {tags.smoking.map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag('smokingHabits', tag)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      filters.smokingHabits.includes(tag)
                        ? 'bg-yellow-400 text-yellow-900'
                        : 'bg-white border border-gray-300 text-gray-700'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Drinking Habits */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Drinking Habits</label>
              <div className="flex flex-wrap gap-2">
                {tags.drinking.map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag('drinkingHabits', tag)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      filters.drinkingHabits.includes(tag)
                        ? 'bg-yellow-400 text-yellow-900'
                        : 'bg-white border border-gray-300 text-gray-700'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Relationship Goals */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Relationship Goals</label>
              <div className="flex flex-wrap gap-2">
                {tags.relationship.map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag('relationshipGoals', tag)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      filters.relationshipGoals.includes(tag)
                        ? 'bg-yellow-400 text-yellow-900'
                        : 'bg-white border border-gray-300 text-gray-700'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Interests */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
            Interests 🎯
          </h3>
          
          <div className="flex flex-wrap gap-2">
            {tags.interests.map(tag => (
              <button
                key={tag}
                onClick={() => toggleTag('interests', tag)}
                className={`px-3 py-1 rounded-full text-sm ${
                  filters.interests.includes(tag)
                    ? 'bg-yellow-400 text-yellow-900'
                    : 'bg-white border border-gray-300 text-gray-700'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4 pt-4">
          <button
            onClick={handleResetFilters}
            className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center"
          >
            <RotateCcw className="mr-2" size={18} />
            Reset All
          </button>
          <button
            onClick={handleApplyFilters}
            className="flex-1 bg-gradient-to-r from-cyan-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:from-cyan-600 hover:to-pink-600 transition-all"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default Search;