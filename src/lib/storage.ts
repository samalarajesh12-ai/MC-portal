
/**
 * Utility functions for interacting with clinical data.
 * v1.3.0: All core clinical data has been migrated to Firebase Firestore.
 * localStorage is now only used for non-critical session metadata.
 */

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
 * v1.3.0: Clinical data is now prioritized via Firestore.
 */
export const seedStorage = () => {
  if (typeof window === 'undefined') return;

  const SEED_KEY = 'maruthi_clinic_v1.3.0_cloud_sync_active';

  if (!localStorage.getItem(SEED_KEY)) {
    localStorage.setItem(SEED_KEY, 'true');
    console.log("Maruthi Clinic: Portal successfully migrated to Firebase Cloud Sync.");
  }
};
