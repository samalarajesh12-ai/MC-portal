
/**
 * Utility functions for interacting with localStorage safely in a Next.js environment.
 * This acts as our "Client-Side Database" for Maruthi Clinic.
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
 * Seeds localStorage with initial professional clinical data.
 * This runs once per browser to ensure the app is never "empty".
 */
export const seedStorage = () => {
  if (typeof window === 'undefined') return;

  // Bumped version for Dr. Raj Kumar update and additional initial appointments
  const SEED_KEY = 'maruthi_clinic_v1.2.4_final_sync';

  if (!localStorage.getItem(SEED_KEY)) {
    // 1. Core User Collections
    setStorageItem('patients', getStorageItem('patients', []));
    setStorageItem('doctors', initialDoctors);
    
    // 2. Clinical Activity Data
    setStorageItem('appointments', initialAppointments);
    setStorageItem('medications', initialMedications);
    setStorageItem('bills', initialBills);
    
    // 3. Health Record System
    setStorageItem('labResults', initialLabResults);
    setStorageItem('medicalHistory', initialMedicalHistory);
    
    // 4. System Notifications
    if (!localStorage.getItem('notifications')) setStorageItem('notifications', []);
    
    // Mark as seeded to prevent overwriting user data on next reload
    localStorage.setItem(SEED_KEY, 'true');
    console.log("Maruthi Clinic: Professional storage seeded with final doctor list and appointments.");
  }
};
