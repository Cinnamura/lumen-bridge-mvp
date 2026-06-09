export const LOAN_CONFIG = {
  personal: {
    minAmount: 500,
    maxAmount: 50_000,
    minDays: 7,
    maxDays: 90,
    dailyRate: 0.008,
  },
  business: {
    minAmount: 30_000,
    maxAmount: 500_000,
    minMonths: 1,
    maxMonths: 12,
  },
} as const;

/**
 * Annuity payment formula:
 * A = P × (r × (1 + r)^n) / ((1 + r)^n − 1)
 * Total = A × n
 *
 * @param P - principal amount (EUR)
 * @param r - daily interest rate (0.008 = 0.8%/day)
 * @param n - term in days
 */
export function calcAnnuity(
  P: number,
  r: number,
  n: number,
): { payment: number; total: number } {
  const factor = Math.pow(1 + r, n);
  const payment = (P * r * factor) / (factor - 1);
  const total = payment * n;
  return {
    payment: Math.round(payment * 100) / 100,
    total: Math.round(total * 100) / 100,
  };
}
