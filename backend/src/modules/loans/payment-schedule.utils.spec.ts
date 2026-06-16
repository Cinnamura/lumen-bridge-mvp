import { normalizeScheduleRows, splitAmount } from './payment-schedule.utils';

describe('payment schedule utils', () => {
  it('splits remaining debt so the last payment absorbs rounding residue', () => {
    expect(splitAmount(2154.37, 5)).toEqual([430.87, 430.87, 430.87, 430.87, 430.89]);
  });

  it('keeps the sum of pending rows equal to the real remaining debt after an extra payment', () => {
    const now = new Date('2026-06-16T12:00:00.000Z');
    const rows = Array.from({ length: 5 }, (_, index) => ({
      id: `row-${index + 1}`,
      seq: index + 1,
      dueDate: new Date(`2026-06-${17 + index}T00:00:00.000Z`),
      amount: 442.39,
      status: 'pending' as const,
      paidAt: null,
    }));

    const normalized = normalizeScheduleRows({
      rows,
      totalRepayment: 2211.95,
      totalPaid: 57.58,
      now,
    });

    const pending = normalized.rows.filter((row) => row.status !== 'paid');
    const pendingSum = pending.reduce((sum, row) => sum + row.amount, 0);

    expect(Number(pendingSum.toFixed(2))).toBe(2154.37);
    expect(normalized.remainingAmount).toBe(2154.37);
  });

  it('preserves a mathematically consistent total after a partial prepayment', () => {
    const now = new Date('2026-06-16T12:00:00.000Z');
    const rows = Array.from({ length: 5 }, (_, index) => ({
      id: `row-${index + 1}`,
      seq: index + 1,
      dueDate: new Date(`2026-06-${17 + index}T00:00:00.000Z`),
      amount: 100,
      status: 'pending' as const,
      paidAt: null,
    }));

    const normalized = normalizeScheduleRows({
      rows,
      totalRepayment: 500,
      totalPaid: 150,
      now,
    });

    expect(normalized.rows.filter((row) => row.status === 'paid').map((row) => row.amount)).toEqual([100, 50]);
    expect(normalized.rows.filter((row) => row.status !== 'paid').map((row) => row.amount)).toEqual([116.66, 116.66, 116.68]);
    expect(Number(normalized.rows.reduce((sum, row) => sum + row.amount, 0).toFixed(2))).toBe(500);
  });
});
