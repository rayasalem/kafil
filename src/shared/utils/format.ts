/**
 * Professional formatting utilities for the Kafeel platform.
 */

/**
 * Formats a number as USD currency.
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Formats a number as a locale-aware decimal.
 */
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num);
};

/**
 * Formats a date to a readable string (Arabic locale).
 */
export const formatDate = (date: Date | string | number): string => {
  const d = new Date(date);
  return new Intl.DateTimeFormat('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
};
