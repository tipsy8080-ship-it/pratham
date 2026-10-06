/**
 * Indian Number Formatting Utilities
 * Handles Lakhs (L), Crores (Cr), and localized comma separation
 */

export function formatINR(val: number, showDecimals = false): string {
  if (isNaN(val) || val === null || val === undefined) return '₹0';
  const rounded = showDecimals ? Math.round(val * 100) / 100 : Math.round(val);
  const isNegative = rounded < 0;
  const absVal = Math.abs(rounded);

  // Format with Indian comma system
  const str = showDecimals ? absVal.toFixed(2) : Math.floor(absVal).toString();
  const parts = str.split('.');
  let lastThree = parts[0].substring(parts[0].length - 3);
  const otherNumbers = parts[0].substring(0, parts[0].length - 3);
  if (otherNumbers !== '') {
    lastThree = ',' + lastThree;
  }
  const res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
  const decimalPart = parts[1] ? `.${parts[1]}` : '';

  return `${isNegative ? '-' : ''}₹${res}${decimalPart}`;
}

export function formatINRLakhs(val: number): string {
  if (isNaN(val) || val === 0) return '₹0';
  const absVal = Math.abs(val);
  const isNegative = val < 0;
  const prefix = isNegative ? '-' : '';

  if (absVal >= 10000000) {
    const cr = absVal / 10000000;
    return `${prefix}₹${cr % 1 === 0 ? cr.toFixed(0) : cr.toFixed(2)} Cr`;
  }
  if (absVal >= 100000) {
    const l = absVal / 100000;
    return `${prefix}₹${l % 1 === 0 ? l.toFixed(0) : l.toFixed(1)}L`;
  }
  if (absVal >= 1000) {
    const k = absVal / 1000;
    return `${prefix}₹${k % 1 === 0 ? k.toFixed(0) : k.toFixed(1)}k`;
  }
  return `${prefix}₹${Math.round(absVal)}`;
}

export function formatPercent(val: number, decimals = 1): string {
  if (isNaN(val)) return '0%';
  return `${val.toFixed(decimals)}%`;
}

export function formatRatioPercent(ratio: number): string {
  return `${Math.round(ratio * 100)}%`;
}
