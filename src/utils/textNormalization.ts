/**
 * Limpia y estandariza cadenas de texto para motores de búsqueda.
 * Elimina acentos, pasa a minúsculas y expande abreviaturas comunes de LATAM.
 */
export const normalizeSearchText = (text: string): string => {
  if (!text) return '';

  // 1. Minúsculas y remover acentos/diacríticos (ej. á -> a)
  let normalized = text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  // 2. Diccionario de equivalencias de unidades LATAM
  // Usamos expresiones regulares con \b (word boundary) para reemplazar palabras exactas,
  // evitando que "milagro" se convierta en "mililitroagro".
  const unitMap: Record<string, string> = {
    'kg': 'kilogramo',
    'kilo': 'kilogramo',
    'kilos': 'kilogramo',
    'g': 'gramo',
    'gr': 'gramo',
    'grs': 'gramo',
    'gramos': 'gramo',
    'ml': 'mililitro',
    'mili': 'mililitro',
    'l': 'litro',
    'lt': 'litro',
    'lts': 'litro',
    'pz': 'pieza',
    'pza': 'pieza',
    'pzas': 'pieza'
  };

  Object.keys(unitMap).forEach(key => {
    const regex = new RegExp(`\\b${key}\\b`, 'g');
    normalized = normalized.replace(regex, unitMap[key]);
  });

  // 3. Quitar espacios múltiples y espacios al inicio/final
  return normalized.replace(/\s+/g, ' ').trim();
};

/**
 * Escapa caracteres especiales de Regex para evitar que la app crashee 
 * si el usuario teclea símbolos como (, ), *, +, ?, [, ], etc.
 */
export const escapeRegExp = (text: string): string => {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};