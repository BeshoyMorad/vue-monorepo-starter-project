/** Currencies the wallet API knows */
export type WalletCurrency = 'SAR' | 'USD';

export type WalletStatus = 'PENDING_ACTIVATION' | 'ACTIVE' | 'SUSPENDED' | 'CLOSED';

/**
 * GET wallets/current-user. Amounts come twice: in major units (`availableBalance`, riyals)
 * and in minor units (`…Minor`, halalas). The site shows the major ones.
 */
export interface Wallet {
  walletId: string;
  userId: string;
  kind: 'USER_WALLET' | 'MERCHANT_ESCROW' | 'SYSTEM_FLOAT';
  status: WalletStatus;
  currency: WalletCurrency;
  /** Spendable now: posted balance minus money on its way out */
  availableBalance: number;
  postedBalance: number;
  pendingInflow: number;
  pendingOutflow: number;
  totalPaid: number;
  createdAt: string;
  updatedAt: string;
}

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

export interface WalletPageMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/** A page of history, whatever key the API puts the list under (see services.ts) */
export interface WalletHistoryPage {
  items: WalletTransaction[];
  meta: WalletPageMeta;
}

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

/** PUT wallets/pin/current-user: changes the PIN and activates the wallet */
export interface ChangePinRequest {
  oldPin: string;
  newPin: string;
  confirmPin: string;
}
