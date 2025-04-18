// import { getMultiValue, removeQuotes } from './help-functions.js'

export default function setupLocalSave(saveArgs) {
    if (!Array.isArray(saveArgs)) return;
    let [target, key, event = 'data-updated'] = saveArgs;
    if (!key || typeof key !== 'string') return;
  
    // Try to restore data from localStorage on init
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        Object.assign(target, parsed); // merge with existing
      } catch (e) {
        console.warn(`Failed to parse saved data for key "${key}"`);
      }
    }
  
    // Auto-save on event
    document.addEventListener(event, () => {
      try {
        localStorage.setItem(key, JSON.stringify(target));
      } catch (e) {
        console.warn(`Failed to save data to localStorage key "${key}"`);
      }
    });
  
    // Optional: method to manually trigger save
    this.saveToLocal = () => {
      try {
        localStorage.setItem(key, JSON.stringify(target));
      } catch (e) {
        console.warn(`Failed to manually save data to localStorage key "${key}"`);
      }
    };
  }
  