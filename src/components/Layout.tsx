import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <div className="w-full max-w-none sm:max-w-2xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto bg-white min-h-screen">
        <Outlet />
        <Navigation />
      </div>
    </div>
  );
};

export default Layout;