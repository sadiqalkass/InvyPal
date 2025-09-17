import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"


export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateStr) {
  if (!dateStr) return 'Unknown date';
  const d = new Date(dateStr);
  if (isNaN(d)) return 'Invalid date';
  return d.toLocaleString('en-GB', { timeZone: 'Africa/Lagos', hour12: false });
}