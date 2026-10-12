/** Insurance policies / trips of the customer, by status */
export interface CustomerStats {
  total: number;
  active: number;
  inactive: number;
  suspended: number;
}

/** Domains with customer statistics, in the order the overview tabs show them */
export const STATS_DOMAINS = ['marketplace', 'transportation', 'veterinary', 'insurance'] as const;
export type StatsDomain = (typeof STATS_DOMAINS)[number];
