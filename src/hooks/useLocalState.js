import { useState, useEffect } from 'react';

export default function useLocalState(key, defaultValue) {
  const [state, setState] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch { /* storage full or unavailable */ }
  }, [key, state]);

  return [state, setState];
}
