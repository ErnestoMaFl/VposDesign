import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Configuramos un temporizador que actualizará el valor después del delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Si el valor cambia antes de que termine el delay, cancelamos el temporizador anterior
    // Esto es lo que previene que se dispare en cada tecla
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}