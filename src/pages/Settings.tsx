import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Bell, 
  Shield, 
  Globe, 
  HelpCircle, 
  LogOut, 
  ChevronRight,
  Settings as SettingsIcon,
  Heart,
  CreditCard,
  Share2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useAppStore, useAuthStore } from '../store';
import Header from '../components/Header';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../components/LanguageSelector';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { language } = useAppStore();
  const { user } = useAuthStore();
  const { t } = useTranslation();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const settingsGroups = [
    {
      title: 'Account',
      items: [
        {
          icon: User,
          label: 'Edit Profile',
          description: 'Update your personal information',
          action: () => navigate('/profile/edit'),
          color: 'text-blue-500'
        },
        {
          icon: Heart,
          label: 'My Favorites',
          description: 'View saved profiles',
          action: () => navigate('/favorites'),
          color: 'text-red-500'
        },
        {
          icon: CreditCard,
          label: 'Subscription',
          description: 'Manage your plan',
          action: () => navigate('/subscription'),
          color: 'text-green-500'
        }
      ]
    },
    {
      title: 'Preferences',
      items: [
        {
          icon: Bell,
          label: 'Notifications',
          description: 'Manage notification settings',
          action: () => navigate('/settings/notifications'),
          color: 'text-yellow-500'
        },
        {
          icon: Shield,
          label: 'Privacy & Security',
          description: 'Control your privacy settings',
          action: () => navigate('/settings/privacy'),
          color: 'text-purple-500'
        },
        {
          icon: Globe,
          label: 'Language',
          description: `Current: ${language.toUpperCase()}`,
          component: <LanguageSelector variant="dropdown" />,
          color: 'text-cyan-500'
        }
      ]
    },
    {
      title: 'Support',
      items: [
        {
          icon: HelpCircle,
          label: 'Help & Support',
          description: 'Get help and contact support',
          action: () => navigate('/help'),
          color: 'text-indigo-500'
        },
        {
          icon: Share2,
          label: 'Invite Friends',
          description: 'Share JodiConnect with friends',
          action: () => {
            if (navigator.share) {
              navigator.share({
                title: 'JodiConnect',
                text: 'Find your perfect match on JodiConnect!',
                url: window.location.origin
              });
            }
          },
          color: 'text-pink-500'
        }
      ]
    }
  ];

  return (
    <div className="pb-20 bg-gray-50 min-h-screen">
      <Header 
        title="Settings" 
        subtitle="Manage your account and preferences"
        showBack={true}
        gradient={true}
      />

      <div className="px-4 py-6 space-y-6">
        {/* User Info Card */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-pink-400 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-lg">
                {user?.displayName || 'User'}
              </h3>
              <p className="text-gray-600 text-sm">
                {user?.phoneNumber || user?.email || 'No contact info'}
              </p>
              <div className="flex items-center mt-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-xs text-green-600 font-medium">Profile Complete</span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Settings Groups */}
        {settingsGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide px-2">
              {group.title}
            </h4>
            
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {group.items.map((item, itemIndex) => (
                <div key={itemIndex}>
                  <button
                    onClick={item.action}
                    disabled={!item.action}
                    className="w-full p-4 flex items-center space-x-4 hover:bg-gray-50 transition-colors disabled:cursor-default"
                  >
                    <div className={`w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center ${item.color}`}>
                      <item.icon size={20} />
                    </div>
                    
                    <div className="flex-1 text-left">
                      <h5 className="font-medium text-gray-900">{item.label}</h5>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                    
                    {item.component ? (
                      <div className="min-w-[120px]">
                        {item.component}
                      </div>
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                  
                  {itemIndex < group.items.length - 1 && (
                    <div className="border-b border-gray-100 ml-14" />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Logout Button */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <button
            onClick={handleLogout}
            className="w-full p-4 flex items-center space-x-4 hover:bg-red-50 transition-colors text-red-600"
          >
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <LogOut size={20} />
            </div>
            
            <div className="flex-1 text-left">
              <h5 className="font-medium">Sign Out</h5>
              <p className="text-sm text-gray-600">Sign out of your account</p>
            </div>
            
            <ChevronRight className="w-5 h-5 text-red-400" />
          </button>
        </div>

        {/* App Info */}
        <div className="text-center py-4">
          <p className="text-xs text-gray-500">
            JodiConnect v{import.meta.env.VITE_APP_VERSION || '0.0.11'}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Made with ❤️ in India
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;