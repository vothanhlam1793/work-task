import { useState, useEffect, useRef } from 'react';

export function useAutoSave(data, saveFn, delay = 2000) {
  const [hasChanges, setHasChanges] = useState(false);
  const dataRef = useRef(data);

  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  useEffect(() => {
    if (!hasChanges) return;

    const timer = setTimeout(() => {
      saveFn(dataRef.current);
      setHasChanges(false);
    }, delay);

    return () => clearTimeout(timer);
  }, [hasChanges, delay, saveFn]);

  const markDirty = () => setHasChanges(true);

  return { markDirty, hasChanges };
}
