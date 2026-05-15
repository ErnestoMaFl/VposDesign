// src/hooks/useOnClickOutside.ts
import { useEffect, type RefObject } from 'react';

type Event = MouseEvent | TouchEvent;

export const useOnClickOutside = <T extends HTMLElement = HTMLElement>(
  ref: RefObject<T | null>,
  handler: (event: Event) => void
) => {
  useEffect(() => {
    const listener = (event: Event) => {
      const el = ref?.current;
      // Si el click fue en el elemento o en sus hijos, no hacemos nada
      if (!el || el.contains((event?.target as Node) || null)) {
        return;
      }
      // Si fue afuera, disparamos el handler (que cerrará el dropdown)
      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    // Limpiamos los eventos al desmontar para no crear fugas de memoria
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
};