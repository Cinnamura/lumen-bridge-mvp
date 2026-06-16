export interface ScheduleSnapshotRow {
  id: string;
  seq: number;
  dueDate: Date;
  amount: number;
  status: 'pending' | 'paid' | 'overdue';
  paidAt?: Date | null;
}

export interface NormalizedScheduleRow {
  id: string;
  seq: number;
  dueDate: Date;
  amount: number;
  status: 'pending' | 'paid' | 'overdue';
  paidAt: Date | null;
}

function startOfDay(date: Date): Date {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
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

export function normalizeScheduleRows(params: {
  rows: ScheduleSnapshotRow[];
  totalRepayment: number;
  totalPaid: number;
  now?: Date;
}): {
  rows: NormalizedScheduleRow[];
  paidAmount: number;
  remainingAmount: number;
  allPaid: boolean;
} {
  const now = params.now ?? new Date();
  const today = startOfDay(now);
  const paidAmount = roundMoney(Math.max(0, params.totalPaid));
  const remainingAmount = roundMoney(Math.max(0, params.totalRepayment - paidAmount));

  let paymentPool = paidAmount;
  const paidRows: NormalizedScheduleRow[] = [];
  const futureRows: ScheduleSnapshotRow[] = [];

  for (const row of params.rows) {
    const rowAmount = roundMoney(row.amount);
    if (paymentPool > 0.0001) {
      const coveredAmount = roundMoney(Math.min(paymentPool, rowAmount));
      paidRows.push({
        id: row.id,
        seq: row.seq,
        dueDate: row.dueDate,
        amount: coveredAmount,
        status: 'paid',
        paidAt: row.paidAt ?? now,
      });
      paymentPool = roundMoney(paymentPool - coveredAmount);
      continue;
    }
    futureRows.push(row);
  }

  const redistributed = splitAmount(remainingAmount, futureRows.length);
  const pendingRows: NormalizedScheduleRow[] = futureRows.map((row, index) => ({
    id: row.id,
    seq: row.seq,
    dueDate: row.dueDate,
    amount: redistributed[index] ?? 0,
    status: row.dueDate < today ? 'overdue' : 'pending',
    paidAt: null,
  }));

  return {
    rows: [...paidRows, ...pendingRows],
    paidAmount,
    remainingAmount,
    allPaid: pendingRows.length === 0,
  };
}
