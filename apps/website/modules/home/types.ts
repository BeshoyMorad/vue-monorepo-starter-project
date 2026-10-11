/**
 * GET /stats/platform (public). `partial: true` means some counts could not be computed;
 * those come back missing or null, so every count is optional.
 */
export interface PlatformStats {
  merchantsCount?: number | null;
  productsCount?: number | null;
  doctorsCount?: number | null;
  purchaseOperationsCount?: number | null;
  transportOperationsCount?: number | null;
  insurancePoliciesCount?: number | null;
  partial?: boolean;
}

export type PlatformStatKey = Exclude<keyof PlatformStats, 'partial'>;
