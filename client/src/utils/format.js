export const formatNumber = (n, digits = 0) =>
  Number(n).toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits });

// 12345678 -> "12.3M"
export function formatCompact(n) {
  const abs = Math.abs(n);
  if (abs >= 1e9) return `${(n / 1e9).toFixed(2)}B`;
  if (abs >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (abs >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return formatNumber(n);
}

export const formatUsd = (n) => `$${formatCompact(n)}`;
export const formatMt = (n) => `${formatNumber(n)} MT`;

export function formatPercent(n, digits = 1, signed = false) {
  const v = (n * 100).toFixed(digits);
  return signed && n > 0 ? `+${v}%` : `${v}%`;
}

export function formatDateTime(iso) {
  return new Date(iso).toLocaleString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

export function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}
