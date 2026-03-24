import { useState, useCallback } from 'react';

const MAIN_KEY = 'pokopia-found-main';
const EVENT_KEY = 'pokopia-found-events';

function loadSet(key: string): Set<string> {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as string[]);
  } catch {
    return new Set();
  }
}

function saveSet(key: string, set: Set<string>) {
  localStorage.setItem(key, JSON.stringify([...set]));
}

export function useTracker(isEvent = false) {
  const key = isEvent ? EVENT_KEY : MAIN_KEY;
  const [found, setFound] = useState<Set<string>>(() => loadSet(key));

  const toggle = useCallback(
    (number: string) => {
      setFound((prev) => {
        const next = new Set(prev);
        if (next.has(number)) {
          next.delete(number);
        } else {
          next.add(number);
        }
        saveSet(key, next);
        return next;
      });
    },
    [key]
  );

  const isFound = useCallback((number: string) => found.has(number), [found]);

  return { found, toggle, isFound, count: found.size };
}
