/**
 * Utility functions for interacting with localStorage safely in a Next.js environment.
 */
import { appointments, medications, messages, bills, doctors as initialDoctors, labResults, medicalHistory } from './data';

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
 * Seeds localStorage with initial data if it doesn't already exist.
 * This ensures that even on first load, there's data to display.
 */
export const seedStorage = () => {
  if (typeof window === 'undefined') return;

  const keys = ['appointments', 'medications', 'messages', 'bills', 'doctors', 'labResults', 'medicalHistory'];
  
  if (!localStorage.getItem('seed_v1')) {
    if (!localStorage.getItem('appointments')) setStorageItem('appointments', appointments);
    if (!localStorage.getItem('medications')) setStorageItem('medications', medications);
    if (!localStorage.getItem('messages')) setStorageItem('messages', messages);
    if (!localStorage.getItem('bills')) setStorageItem('bills', bills);
    if (!localStorage.getItem('doctors')) setStorageItem('doctors', initialDoctors);
    if (!localStorage.getItem('labResults')) setStorageItem('labResults', labResults);
    if (!localStorage.getItem('medicalHistory')) setStorageItem('medicalHistory', medicalHistory);
    
    localStorage.setItem('seed_v1', 'true');
  }
};
