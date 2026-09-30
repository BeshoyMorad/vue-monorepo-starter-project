/**
 * Demo endpoint for the Data Fetching docs page (TanStack Query example).
 * Returns values that change on every request, like a live dashboard metric.
 */
export default defineEventHandler(() => ({
  activeUsers: 120 + Math.floor(Math.random() * 40),
  requestsPerMinute: 900 + Math.floor(Math.random() * 300),
  generatedAt: new Date().toISOString(),
}));
