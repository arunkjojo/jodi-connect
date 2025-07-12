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

// Helper function to check if location data exists
export const checkLocationDataExists = async () => {
  try {
    // You can implement a separate function to check if data exists
    // or use the existing functions to get a count
    return true;
  } catch (error) {
    console.error('Error checking location data:', error);
    return false;
  }
};