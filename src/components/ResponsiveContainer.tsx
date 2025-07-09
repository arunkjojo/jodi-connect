import React from 'react';
import { useResponsive } from '../hooks/useResponsive';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  mobileClassName?: string;
  tabletClassName?: string;
  desktopClassName?: string;
}

const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  className = '',
  mobileClassName = '',
  tabletClassName = '',
  desktopClassName = ''
}) => {
  const { screenSize } = useResponsive();

  const getResponsiveClassName = () => {
    switch (screenSize) {
      case 'mobile':
        return `${className} ${mobileClassName}`;
      case 'tablet':
        return `${className} ${tabletClassName}`;
      case 'desktop':
        return `${className} ${desktopClassName}`;
      default:
        return className;
    }
  };

  return (
    <div className={getResponsiveClassName()}>
      {children}
    </div>
  );
};

export default ResponsiveContainer;