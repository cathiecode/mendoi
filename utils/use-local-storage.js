import { useState, useEffect, useCallback } from 'https://unpkg.com/preact@latest/hooks/dist/hooks.module.js?module';

export default function useLocalStorage(initValue, key) {
  const savedValue = localStorage.getItem(key);
  const [value, setValue] = useState(savedValue !== null ? savedValue : initValue);

  useEffect(() => {
    localStorage.setItem(key, value);
  }, [value]);

  return [value, setValue];
}
