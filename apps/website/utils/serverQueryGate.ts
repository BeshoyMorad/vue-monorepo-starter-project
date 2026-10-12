import type { QueryClient } from '@tanstack/vue-query';

interface Gate {
  /** > 0 while a useServerPrefetch callback is creating its queries */
  optingIn: number;
  /** Query hashes allowed to run on the server for this request */
  allowed: Set<string>;
  /** Dev switch: nothing runs on the server, every call goes through the browser */
  blockAll: boolean;
}

const gates = new WeakMap<QueryClient, Gate>();

/**
 * Server only. Stops TanStack queries from fetching during server rendering unless a
 * component opted in with useServerPrefetch. Without this, every enabled useQuery fires
 * a request on the server, even ones the page never waits for.
 * Opted-in queries keep their own `enabled` value (e.g. "only when signed in").
 */
export function installServerQueryGate(client: QueryClient, { blockAll = false } = {}): void {
  const gate: Gate = { optingIn: 0, allowed: new Set(), blockAll };
  gates.set(client, gate);

  const defaultQueryOptions = client.defaultQueryOptions.bind(client);
  client.defaultQueryOptions = ((options) => {
    const defaulted = defaultQueryOptions(options);
    const hash = defaulted.queryHash;
    if (!gate.blockAll && gate.optingIn > 0 && hash) {
      gate.allowed.add(hash);
    }
    const allowed = !gate.blockAll && !!hash && gate.allowed.has(hash);
    return allowed ? defaulted : { ...defaulted, enabled: false };
  }) as QueryClient['defaultQueryOptions'];
}

/** Runs `create` with its queries allowed to fetch on the server. */
export function allowOnServer<T>(client: QueryClient, create: () => T): T {
  const gate = gates.get(client);
  if (!gate) {
    return create();
  }
  gate.optingIn++;
  try {
    return create();
  } finally {
    gate.optingIn--;
  }
}

/** Whether the dev switch has turned off all server fetching. */
export function isServerFetchBlocked(client: QueryClient): boolean {
  return gates.get(client)?.blockAll ?? false;
}
