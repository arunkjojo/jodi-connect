import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Heart, Settings } from 'lucide-react';
import { NAVIGATION_ITEMS } from '../constants';

const Navigation: React.FC = () => {
  const location = useLocation();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Home': return Home;
      case 'Search': return Search;
      case 'Heart': return Heart;
      case 'Settings': return Settings;
      default: return Home;
    }
  };

  return (
    <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-200 px-4 py-2">
      <div className="flex justify-around">
        {NAVIGATION_ITEMS.map(({ path, icon, label }) => {
          const Icon = getIcon(icon);
          return (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${location.pathname === path
                  ? 'text-cyan-500 bg-cyan-50'
                  : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              <Icon size={20} />
              <span className="text-xs mt-1">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;