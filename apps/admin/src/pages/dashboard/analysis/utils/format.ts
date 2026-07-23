const numberFormatter = new Intl.NumberFormat("en-US");

/**
 * Format a number with thousand separators.
 */
export const formatNumber = (val: number | string): string => {
  const parsed = Number(val);
  return Number.isFinite(parsed) ? numberFormatter.format(parsed) : "";
};

/**
 * Format a number as yuan currency string.
 */
export const formatYuan = (val: number | string) => `¥ ${formatNumber(val)}`;
