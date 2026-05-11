// Instanciamos el formateador UNA SOLA VEZ en la memoria global de la app
const mxnFormatter = new Intl.NumberFormat('es-MX', { 
  style: 'currency', 
  currency: 'MXN' 
});

export const formatCurrency = (amount: number): string => {
  return mxnFormatter.format(amount);
};

export const formatCurrencyParts = (amount: number) => {
  const parts = mxnFormatter.formatToParts(amount);
  const whole = parts.filter(p => p.type !== 'fraction' && p.type !== 'decimal').map(p => p.value).join('');
  const fraction = parts.filter(p => p.type === 'decimal' || p.type === 'fraction').map(p => p.value).join('');
  return { whole, fraction };
};