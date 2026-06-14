
export function formatINR(paise: number): string {
  const rupees = paise / 100;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(rupees);
}

/**
 * Formats a percentage for display.
 *
 * @param value - Number between 0 and 100
 * @returns Formatted string (e.g., "20%")
 */
export function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}

/**
 * Rounds paise to the nearest integer rupee (nearest 100 paise).
 * Used for edge cases where discount calculations produce fractional paise.
 *
 * @param paise - Amount in paise, possibly fractional
 * @returns Amount in paise, rounded to nearest integer
 */
export function roundPaise(paise: number): number {
  return Math.round(paise);
}
