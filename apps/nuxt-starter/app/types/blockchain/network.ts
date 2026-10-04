/** Blockchain network as returned by the API. */
// A type alias, not an interface, so it fits `Record<string, unknown>` option lists.
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type Network = {
  id: number;
  name: string;
  symbol: string;
  logo?: string | null;
};
