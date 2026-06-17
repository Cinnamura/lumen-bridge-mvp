import { calcAnnuity } from '../../common/utils/loan-calculator';

export type ScheduleStatus = 'UNPAID' | 'PARTIALLY_PAID' | 'PAID' | 'OVERDUE' | 'SKIPPED_EARLY_PAYMENT';

export interface ScheduleSnapshotRow {
  id: string;
  seq: number;
  dueDate: Date;
}

export interface PaymentSnapshot {
  amount: number;
  recordedAt: Date;
}

export interface ReplayedScheduleRow {
  id: string;
  seq: number;
  dueDate: Date;
  amountRequired: number;
  amountPaid: number;
  amountRemaining: number;
  status: ScheduleStatus;
  paidAt: Date | null;
}

function startOfUtcDay(date: Date): Date {
  const next = new Date(date);
  next.setUTCHours(0, 0, 0, 0);
  return next;
}

export function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function splitAmount(total: number, count: number): number[] {
  if (count <= 0) return [];
  const totalCents = Math.max(0, Math.round(total * 100));
  const base = Math.floor(totalCents / count);
  const amounts = Array.from({ length: count }, () => base / 100);
  const allocated = base * (count - 1);
  amounts[count - 1] = (totalCents - allocated) / 100;
  return amounts.map(roundMoney);
}

export function buildInstallmentAmounts(principal: number, dailyRate: number, count: number): number[] {
  if (count <= 0) return [];
  if (principal <= 0) return Array.from({ length: count }, () => 0);

  const { payment, total } = calcAnnuity(principal, dailyRate, count);
  const amounts = Array.from({ length: count }, () => payment);
  amounts[count - 1] = roundMoney(total - payment * (count - 1));
  return amounts.map(roundMoney);
}

function computeScheduledPrincipal(principal: number, dailyRate: number, amountRequired: number): number {
  if (principal <= 0 || amountRequired <= 0) return 0;
  const interestPart = roundMoney(principal * dailyRate);
  const principalPart = roundMoney(amountRequired - interestPart);
  return roundMoney(Math.min(principal, Math.max(0, principalPart)));
}

function deriveStatus(row: {
  dueDate: Date;
  amountRequired: number;
  amountPaid: number;
  paidAt: Date | null;
}, today: Date): ScheduleStatus {
  // Row was wiped to zero by an early/over-payment rather than a direct payment.
  // amountRequired==0 AND amountPaid==0 AND paidAt set means the principal was
  // cleared by an overpayment cascade, not a genuine day-by-day settlement.
  if (row.amountRequired <= 0.0001 && row.amountPaid <= 0.0001 && row.paidAt !== null) {
    return 'SKIPPED_EARLY_PAYMENT';
  }
  if (row.amountRequired <= 0.0001 || row.amountPaid >= row.amountRequired - 0.0001) {
    return 'PAID';
  }
  if (startOfUtcDay(row.dueDate).getTime() < today.getTime()) {
    return 'OVERDUE';
  }
  if (row.amountPaid > 0.0001) {
    return 'PARTIALLY_PAID';
  }
  return 'UNPAID';
}

export function replayScheduleRows(params: {
  rows: ScheduleSnapshotRow[];
  principal: number;
  dailyRate: number;
  payments: PaymentSnapshot[];
  now?: Date;
}): {
  rows: ReplayedScheduleRow[];
  paidAmount: number;
  remainingAmount: number;
  totalRepayment: number;
  currentDailyPayment: number;
  outstandingPrincipal: number;
  allPaid: boolean;
} {
  const now = params.now ?? new Date();
  const today = startOfUtcDay(now);
  const principal = roundMoney(Math.max(0, params.principal));
  const initialAmounts = buildInstallmentAmounts(principal, params.dailyRate, params.rows.length);

  const rows: ReplayedScheduleRow[] = params.rows.map((row, index) => ({
    id: row.id,
    seq: row.seq,
    dueDate: row.dueDate,
    amountRequired: initialAmounts[index] ?? 0,
    amountPaid: 0,
    amountRemaining: initialAmounts[index] ?? 0,
    status: 'UNPAID',
    paidAt: null,
  }));

  let outstandingPrincipal = principal;
  let currentIndex = 0;

  for (const payment of params.payments) {
    let remainingPayment = roundMoney(Math.max(0, payment.amount));

    while (remainingPayment > 0.0001 && currentIndex < rows.length) {
      while (
        currentIndex < rows.length &&
        rows[currentIndex] &&
        rows[currentIndex].amountPaid >= rows[currentIndex].amountRequired - 0.0001
      ) {
        currentIndex += 1;
      }

      if (currentIndex >= rows.length) break;

      const currentRow = rows[currentIndex];
      const rowDeficit = roundMoney(currentRow.amountRequired - currentRow.amountPaid);
      if (rowDeficit <= 0.0001) {
        currentIndex += 1;
        continue;
      }

      const appliedToCurrentRow = roundMoney(Math.min(remainingPayment, rowDeficit));
      currentRow.amountPaid = roundMoney(currentRow.amountPaid + appliedToCurrentRow);
      remainingPayment = roundMoney(remainingPayment - appliedToCurrentRow);

      if (currentRow.amountPaid >= currentRow.amountRequired - 0.0001) {
        currentRow.amountPaid = currentRow.amountRequired;
        currentRow.paidAt = payment.recordedAt;

        const scheduledPrincipal = computeScheduledPrincipal(
          outstandingPrincipal,
          params.dailyRate,
          currentRow.amountRequired,
        );
        outstandingPrincipal = roundMoney(Math.max(0, outstandingPrincipal - scheduledPrincipal));
        currentIndex += 1;

        if (remainingPayment > 0.0001) {
          const extraPrincipal = roundMoney(Math.min(remainingPayment, outstandingPrincipal));
          outstandingPrincipal = roundMoney(Math.max(0, outstandingPrincipal - extraPrincipal));
          remainingPayment = roundMoney(remainingPayment - extraPrincipal);

          const futureAmounts = buildInstallmentAmounts(
            outstandingPrincipal,
            params.dailyRate,
            rows.length - currentIndex,
          );

          for (let index = currentIndex; index < rows.length; index += 1) {
            const nextAmount = futureAmounts[index - currentIndex] ?? 0;
            rows[index].amountRequired = nextAmount;
            rows[index].amountPaid = 0;
            rows[index].amountRemaining = nextAmount;
            rows[index].paidAt = outstandingPrincipal <= 0.0001 ? payment.recordedAt : null;
          }
        }
      }
    }
  }

  for (const row of rows) {
    row.amountRequired = roundMoney(row.amountRequired);
    row.amountPaid = roundMoney(Math.min(row.amountPaid, row.amountRequired));
    row.amountRemaining = roundMoney(Math.max(0, row.amountRequired - row.amountPaid));
    row.status = deriveStatus(row, today);
    if (row.status !== 'PAID' && row.amountRequired > 0.0001) {
      row.paidAt = null;
    }
  }

  const paidAmount = roundMoney(
    params.payments.reduce((sum, payment) => sum + Math.max(0, payment.amount), 0),
  );
  const remainingAmount = roundMoney(
    rows.reduce((sum, row) => sum + row.amountRemaining, 0),
  );
  const totalRepayment = roundMoney(
    rows.reduce((sum, row) => sum + row.amountRequired, 0),
  );
  const nextOpenRow = rows.find((row) => row.status !== 'PAID' && row.amountRemaining > 0.0001);

  return {
    rows,
    paidAmount,
    remainingAmount,
    totalRepayment,
    currentDailyPayment: nextOpenRow?.amountRequired ?? 0,
    outstandingPrincipal: roundMoney(outstandingPrincipal),
    allPaid: rows.every((row) => row.status === 'PAID' || row.status === 'SKIPPED_EARLY_PAYMENT'),
  };
}
