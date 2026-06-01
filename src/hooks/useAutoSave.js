import { useState, useEffect, useRef, useCallback } from 'react';

export function useAutoSave(data, saveFn, delay = 2000) {
  const [hasChanges, setHasChanges] = useState(false);
  const dataRef = useRef(data);
  const saveFnRef = useRef(saveFn);

  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  useEffect(() => {
    saveFnRef.current = saveFn;
  }, [saveFn]);

  useEffect(() => {
    if (!hasChanges) return;

    const timer = setTimeout(() => {
      saveFnRef.current(dataRef.current);
      setHasChanges(false);
    }, delay);

    return () => clearTimeout(timer);
  }, [hasChanges]);

  const markDirty = useCallback(() => setHasChanges(true), []);

  return { markDirty, hasChanges };
}
