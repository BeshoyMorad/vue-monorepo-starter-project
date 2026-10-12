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

/** PUT wallets/pin/current-user: changes the PIN and activates the wallet */
export interface ChangePinRequest {
  oldPin: string;
  newPin: string;
  confirmPin: string;
}
