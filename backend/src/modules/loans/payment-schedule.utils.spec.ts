import { buildInstallmentAmounts, replayScheduleRows } from './payment-schedule.utils';

function buildRows() {
  return Array.from({ length: 4 }, (_, index) => ({
    id: `row-${index + 1}`,
    seq: index + 1,
    dueDate: new Date(`2026-06-${17 + index}T00:00:00.000Z`),
  }));
}

describe('payment schedule utils', () => {
  it('keeps installment count fixed and preserves the total annuity amount', () => {
    const amounts = buildInstallmentAmounts(1000, 0.008, 4);

    expect(amounts).toHaveLength(4);
    expect(Number(amounts.reduce((sum, value) => sum + value, 0).toFixed(2))).toBe(1020.08);
  });

  it('marks the current calendar day as partially paid without shifting due dates', () => {
    const rows = buildRows();
    const normalized = replayScheduleRows({
      rows,
      principal: 1000,
      dailyRate: 0.008,
      payments: [{ amount: 50, recordedAt: new Date('2026-06-17T10:00:00.000Z') }],
      now: new Date('2026-06-17T12:00:00.000Z'),
    });

    expect(normalized.rows[0].dueDate.toISOString()).toBe('2026-06-17T00:00:00.000Z');
    expect(normalized.rows[0].status).toBe('PARTIALLY_PAID');
    expect(normalized.rows[0].amountPaid).toBe(50);
    expect(normalized.rows[1].dueDate.toISOString()).toBe('2026-06-18T00:00:00.000Z');
    expect(normalized.rows[1].status).toBe('UNPAID');
  });

  it('reduces future obligations when the payment exceeds the current installment', () => {
    const rows = buildRows();
    const base = buildInstallmentAmounts(1000, 0.008, rows.length);
    const firstDayPayment = base[0] + 50;

    const normalized = replayScheduleRows({
      rows,
      principal: 1000,
      dailyRate: 0.008,
      payments: [{ amount: firstDayPayment, recordedAt: new Date('2026-06-17T10:00:00.000Z') }],
      now: new Date('2026-06-17T12:00:00.000Z'),
    });

    expect(normalized.rows[0].status).toBe('PAID');
    expect(normalized.rows[1].status).toBe('UNPAID');
    expect(normalized.rows[1].dueDate.toISOString()).toBe('2026-06-18T00:00:00.000Z');
    expect(normalized.rows[1].amountRequired).toBeLessThan(base[1]);
    expect(normalized.totalRepayment).toBeLessThan(Number(base.reduce((sum, value) => sum + value, 0).toFixed(2)));
    expect(normalized.outstandingPrincipal).toBeLessThan(752.98);
  });

  it('closes the loan when the borrower pays principal plus one day of interest on day one', () => {
    const normalized = replayScheduleRows({
      rows: buildRows(),
      principal: 1000,
      dailyRate: 0.008,
      payments: [{ amount: 1008, recordedAt: new Date('2026-06-17T10:00:00.000Z') }],
      now: new Date('2026-06-17T12:00:00.000Z'),
    });

    expect(normalized.rows[0].status).toBe('PAID');
    expect(normalized.rows.slice(1).every((row) => row.status === 'SKIPPED_EARLY_PAYMENT')).toBe(true);
    expect(normalized.remainingAmount).toBe(0);
    expect(normalized.outstandingPrincipal).toBe(0);
    expect(normalized.allPaid).toBe(true);
  });

  it('marks an unpaid past day as overdue while preserving already paid part', () => {
    const normalized = replayScheduleRows({
      rows: buildRows(),
      principal: 1000,
      dailyRate: 0.008,
      payments: [{ amount: 40, recordedAt: new Date('2026-06-17T10:00:00.000Z') }],
      now: new Date('2026-06-18T12:00:00.000Z'),
    });

    expect(normalized.rows[0].status).toBe('OVERDUE');
    expect(normalized.rows[0].amountPaid).toBe(40);
    expect(normalized.rows[0].amountRemaining).toBeGreaterThan(0);
  });
});
