/** One month of the analytics chart (see activity.ts) */
export interface MonthActivity {
  /** First day of the month, local time */
  start: Date;
  deposits: { amount: number; count: number };
  withdrawals: { amount: number; count: number };
}
