import React from 'react';
import { ArrowLeft, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  showMenu?: boolean;
  gradient?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showBack = false,
  showMenu = false,
  gradient = false
}) => {
  const navigate = useNavigate();

  return (
    <header className={`${gradient ? 'bg-gradient-to-r from-cyan-400 to-pink-400' : 'bg-white'} px-4 py-3 ${gradient ? 'text-white' : 'text-gray-900'}`}>
      <div className="flex items-center justify-between">
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-black/10 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
        )}

        <div className="flex-1 text-center">
          {title && (
            <h1 className="text-lg font-semibold">{title}</h1>
          )}
          {subtitle && (
            <p className="text-sm opacity-90">{subtitle}</p>
          )}
        </div>

        {showMenu && (
          <button className="p-2 rounded-full hover:bg-black/10 transition-colors">
            <MoreVertical size={20} />
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;