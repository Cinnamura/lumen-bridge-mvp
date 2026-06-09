import { calcAnnuity, LOAN_CONFIG } from './loan-calculator';

describe('calcAnnuity', () => {
  it('returns correct daily payment and total for 10 000 EUR / 30 days', () => {
    const { payment, total } = calcAnnuity(10_000, 0.008, 30);
    // A = 10000 × (0.008 × 1.008^30) / (1.008^30 − 1) ≈ 376.26
    expect(payment).toBeCloseTo(376.26, 1);
    expect(total).toBeCloseTo(11287.71, 0);
  });

  it('total equals payment × n (within rounding)', () => {
    const n = 14;
    const { payment, total } = calcAnnuity(5_000, 0.008, n);
    expect(total).toBeCloseTo(payment * n, 1);
  });

  it('calculates minimum personal loan (500 EUR / 7 days)', () => {
    const { payment, total } = calcAnnuity(500, 0.008, 7);
    expect(payment).toBeGreaterThan(0);
    expect(total).toBeGreaterThan(500);
  });

  it('calculates maximum personal loan (50 000 EUR / 90 days)', () => {
    const { payment, total } = calcAnnuity(50_000, 0.008, 90);
    expect(payment).toBeGreaterThan(0);
    expect(total).toBeGreaterThan(50_000);
  });

  it('LOAN_CONFIG has correct defaults', () => {
    expect(LOAN_CONFIG.personal.dailyRate).toBe(0.008);
    expect(LOAN_CONFIG.personal.minAmount).toBe(500);
    expect(LOAN_CONFIG.personal.maxAmount).toBe(50_000);
    expect(LOAN_CONFIG.personal.minDays).toBe(7);
    expect(LOAN_CONFIG.personal.maxDays).toBe(90);
    expect(LOAN_CONFIG.business.minAmount).toBe(30_000);
    expect(LOAN_CONFIG.business.maxAmount).toBe(500_000);
  });

  it('rounds results to 2 decimal places', () => {
    const { payment, total } = calcAnnuity(1_234, 0.008, 15);
    expect(payment).toBe(Math.round(payment * 100) / 100);
    expect(total).toBe(Math.round(total * 100) / 100);
  });
});
