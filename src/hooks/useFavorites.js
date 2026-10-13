import { useCallback, useEffect, useState } from 'react';

const KEY = 'playzone:favorites';

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

/* Stores only game ids (non-sensitive) in localStorage. */
export default function useFavorites() {
  const [ids, setIds] = useState(load);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(ids));
    } catch {
      /* ignore */
    }
  }, [ids]);

  const toggle = useCallback((id) => {
    setIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }, []);

  const isFavorite = useCallback((id) => ids.includes(id), [ids]);
  return { ids, toggle, isFavorite };
}
