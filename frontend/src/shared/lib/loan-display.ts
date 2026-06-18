export type LoanPresentation = {
  type?: string;
  termDays?: number | null;
  termMonths?: number | null;
  dailyRate?: number | null;
};

export function getLoanType(loan: LoanPresentation) {
  return loan.type === 'business' ? 'business' : 'personal';
}

export function getLoanTermLabel(
  loan: LoanPresentation,
  format: 'full' | 'short' = 'full',
) {
  const type = getLoanType(loan);
  const value = type === 'business' ? (loan.termMonths ?? loan.termDays) : loan.termDays;
  if (!value) return '—';

  if (type === 'business') {
    return `${value} ${format === 'short' ? 'мес.' : 'месяцев'}`;
  }
  return `${value} ${format === 'short' ? 'дн.' : 'дней'}`;
}

export function getLoanRateLabel(loan: LoanPresentation) {
  const rate = Number(loan.dailyRate ?? 0);
  return `${(rate * 100).toFixed(1)}% / ${getLoanType(loan) === 'business' ? 'мес.' : 'день'}`;
}

export function getLoanPaymentLabel(type?: string) {
  return type === 'business' ? 'Ежемесячный платёж' : 'Ежедневный платёж';
}
