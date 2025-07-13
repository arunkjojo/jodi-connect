import { httpsCallable } from 'firebase/functions';
import { functions } from './config';

// Client-side functions to call the import functions
export const importLocationData = async () => {
  const importFunction = httpsCallable(functions, 'importLocationData');
  const result = await importFunction();
  return result.data;
};

export const clearLocationData = async () => {
  const clearFunction = httpsCallable(functions, 'clearLocationData');
  const result = await clearFunction();
  return result.data;
};

export const getLocationStats = async () => {
  const statsFunction = httpsCallable(functions, 'getLocationStats');
  const result = await statsFunction();
  return result.data;
};

// Helper function to check if location data exists
export const checkLocationDataExists = async () => {
  try {
    const stats = await getLocationStats();
    return stats.stats.totalStates > 0 && stats.stats.totalDistricts > 0;
  } catch (error) {
    console.error('Error checking location data:', error);
    return false;
  }
};