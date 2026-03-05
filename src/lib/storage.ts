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

  const SEED_KEY = 'maruthi_clinic_v4_stable';

  if (!localStorage.getItem(SEED_KEY)) {
    // 1. Core User Collections
    if (!localStorage.getItem('patients')) setStorageItem('patients', []);
    if (!localStorage.getItem('doctors')) setStorageItem('doctors', initialDoctors);
    
    // 2. Clinical Activity Data
    if (!localStorage.getItem('appointments')) setStorageItem('appointments', initialAppointments);
    if (!localStorage.getItem('medications')) setStorageItem('medications', initialMedications);
    if (!localStorage.getItem('bills')) setStorageItem('bills', initialBills);
    
    // 3. Health Record System
    if (!localStorage.getItem('labResults')) setStorageItem('labResults', initialLabResults);
    if (!localStorage.getItem('medicalHistory')) setStorageItem('medicalHistory', initialMedicalHistory);
    
    // 4. System Notifications
    if (!localStorage.getItem('notifications')) setStorageItem('notifications', []);
    
    // Mark as seeded to prevent overwriting user data on next reload
    localStorage.setItem(SEED_KEY, 'true');
    console.log("Maruthi Clinic: Professional storage seeded successfully.");
  }
};
