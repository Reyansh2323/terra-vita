import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Normalize and format prices across the app
 * - normalizePrice: Convert minor units (e.g. fils/cents) into major units (AED) when appropriate
 * - formatCurrency: Format number to a currency string with 2 decimals
 */
export function normalizePrice(value: number | string | null | undefined): number {
  if (value == null) return 0;
  const num = typeof value === 'string' ? parseFloat(value) : Number(value);
  if (Number.isNaN(num)) return 0;

  // Heuristic: many seed datasets store prices in minor units (e.g. cents/fils).
  // We assume values >= 1000 are almost certainly minor units (2500 => 25.00 AED).
  // For values between 100 and 999 it's ambiguous; we'll only divide values >= 1000.
  if (num >= 1000) return num / 100;

  // leave smaller numbers as-is (e.g., 25 or 120)
  return num;
}

export function formatCurrency(amount: number, currency = 'AED') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 2 }).format(amount).replace(currency, '').trim();
}
