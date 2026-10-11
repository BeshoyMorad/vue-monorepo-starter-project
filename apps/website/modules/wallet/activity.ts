import { COMPLETED_STATUSES, type WalletTransaction } from './types';

/** Months the analytics chart covers, ending with the current one */
export const CHART_MONTHS = 6;

export interface MonthActivity {
  /** First day of the month, local time */
  start: Date;
  deposits: { amount: number; count: number };
  withdrawals: { amount: number; count: number };
}

/** Transactions where the money actually moved */
export const completed = (items: WalletTransaction[]) =>
  items.filter((item) => COMPLETED_STATUSES.includes(item.status));

/** What a transaction moved, minus anything refunded */
const net = (item: WalletTransaction) => item.amount - (item.refundedAmount ?? 0);

export const sumAmounts = (items: WalletTransaction[]) =>
  items.reduce((total, item) => total + net(item), 0);

/** Completed deposits and withdrawals per month over the last `months`, oldest first */
export function monthlyActivity(
  deposits: WalletTransaction[],
  withdrawals: WalletTransaction[],
  months = CHART_MONTHS,
  now = new Date()
): MonthActivity[] {
  const list: MonthActivity[] = Array.from({ length: months }, (_, index) => ({
    start: new Date(now.getFullYear(), now.getMonth() - (months - 1 - index), 1),
    deposits: { amount: 0, count: 0 },
    withdrawals: { amount: 0, count: 0 },
  }));
  const add = (items: WalletTransaction[], kind: 'deposits' | 'withdrawals') => {
    for (const item of completed(items)) {
      const date = new Date(item.settledAt ?? item.createdAt);
      const month = list.find(
        (entry) =>
          entry.start.getFullYear() === date.getFullYear() &&
          entry.start.getMonth() === date.getMonth()
      );
      if (month) {
        month[kind].amount += net(item);
        month[kind].count += 1;
      }
    }
  };
  add(deposits, 'deposits');
  add(withdrawals, 'withdrawals');
  return list;
}

/** Axis top for a bar chart with 4 gridline steps of 1, 2, 2.5 or 5 × 10ⁿ */
export function niceAxisTop(max: number) {
  if (max <= 0) return 4;
  const step = 10 ** Math.floor(Math.log10(max / 4));
  const nice = [1, 2, 2.5, 5, 10].map((f) => f * step).find((s) => s * 4 >= max) ?? step * 10;
  return nice * 4;
}
