import type { Paginated, PaginationMeta } from '~/types/api';
import type { WalletCurrency } from './wallet';

/** Transaction statuses, in the order the status filter lists them */
export const TRANSACTION_STATUSES = [
  'INITIATED',
  'PENDING',
  'CAPTURED',
  'HELD',
  'SETTLED',
  'VOIDED',
  'EXPIRED',
] as const;
export type TransactionStatus = (typeof TRANSACTION_STATUSES)[number];

/** Money that actually moved: counted in the totals and the chart */
export const COMPLETED_STATUSES: readonly TransactionStatus[] = ['CAPTURED', 'SETTLED'];

export type TransactionDomain =
  | 'VETERINARY'
  | 'TRANSPORTATION'
  | 'MARKETPLACE'
  | 'SPA'
  | 'INSURANCE'
  | 'P2P'
  | 'WITHDRAWAL'
  | 'DEPOSIT'
  | 'REFUND'
  | 'FEE';

/** Domains that add money to the wallet; every other one takes money out */
export const INFLOW_DOMAINS: readonly TransactionDomain[] = ['DEPOSIT', 'REFUND'];

export const PAYMENT_METHODS = ['WALLET', 'CARD', 'BANK_TRANSFER'] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

/** One entry of GET wallets/history */
export interface WalletTransaction {
  transactionId: string;
  ref: string;
  walletId: string;
  userId: string;
  domain: TransactionDomain;
  status: TransactionStatus;
  amount: number;
  refundedAmount: number;
  currency: WalletCurrency;
  createdAt: string;
  updatedAt: string;
  settledAt?: string | null;
  metadata?: Record<string, unknown> | null;
}

export type WalletPageMeta = PaginationMeta;

/** A page of history, whatever key the API puts the list under (see services.ts) */
export type WalletHistoryPage = Paginated<WalletTransaction>;

/** Query of GET wallets/history; empty filters are left out */
export interface WalletHistoryParams {
  page?: number;
  limit?: number;
  walletId?: string;
  domain?: TransactionDomain;
  status?: TransactionStatus;
  paymentMethod?: PaymentMethod;
  /** Exact transaction reference, e.g. TXN-8457t6 */
  ref?: string;
}
