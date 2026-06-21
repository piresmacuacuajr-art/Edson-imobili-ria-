
/**
 * Safe local storage utility with error handling and quota management.
 */

export const safeStorage = {
  get: <T>(key: string, defaultValue: T): T => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        return JSON.parse(saved) as T;
      }
    } catch (e) {
      console.warn(`Error reading from localStorage at key "${key}":`, e);
    }
    return defaultValue;
  },

  set: (key: string, value: any): boolean => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error(`Error saving to localStorage at key "${key}":`, e);
      // Handle QuotaExceededError
      if (e instanceof DOMException && (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED')) {
        console.warn('Storage quota exceeded. Trying to alert user if possible.');
      }
      return false;
    }
  },

  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error(`Error removing from localStorage at key "${key}":`, e);
    }
  }
};
