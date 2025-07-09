import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, Wifi } from 'lucide-react';
import { useNetworkStatus } from '../hooks/useNetworkStatus';

const NetworkStatus: React.FC = () => {
  const { isOnline, isSlowConnection } = useNetworkStatus();

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="fixed top-0 left-0 right-0 bg-red-500 text-white px-4 py-2 z-50"
        >
          <div className="flex items-center justify-center space-x-2">
            <WifiOff size={16} />
            <span className="text-sm font-medium">No internet connection</span>
          </div>
        </motion.div>
      )}
      
      {isOnline && isSlowConnection && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="fixed top-0 left-0 right-0 bg-yellow-500 text-white px-4 py-2 z-50"
        >
          <div className="flex items-center justify-center space-x-2">
            <Wifi size={16} />
            <span className="text-sm font-medium">Slow connection detected</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NetworkStatus;