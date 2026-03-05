
/**
 * Utility functions for interacting with clinical data.
 * Migrated to Firestore for cloud-sync, but maintaining localStorage fallback for session-only metadata.
 */
import { 
  initialAppointments, 
  initialMedications, 
  initialBills, 
  initialLabResults, 
  initialMedicalHistory,
  initialDoctors 
} from './data';

export const getStorageItem = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
};

export const setStorageItem = <T>(key: string, value: T): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting localStorage key "${key}":`, error);
  }
};

export const removeStorageItem = (key: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(key);
};

/**
 * Historical seed function.
 * Cloud sync is now handled primarily via direct Firestore hooks in components.
 */
export const seedStorage = () => {
  if (typeof window === 'undefined') return;

  const SEED_KEY = 'maruthi_clinic_v1.3.0_cloud_sync_ready';

  if (!localStorage.getItem(SEED_KEY)) {
    // We maintain localStorage for local session caching if needed, 
    // but the app now prioritizes Firestore for multi-device visibility.
    localStorage.setItem(SEED_KEY, 'true');
    console.log("Maruthi Clinic: Portal optimized for cloud-sync 2026.");
  }
};
