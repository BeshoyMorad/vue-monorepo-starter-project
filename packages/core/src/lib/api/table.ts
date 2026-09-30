import type { TableParams } from '@workspace/core/composables/useTableState';
import { getApiClient } from './client';

/**
 * Service function to fetch paginated table data.
 * Automatically cleans out undefined/null/empty values from the request payload.
 *
 * @param endpoint The API endpoint to fetch data from.
 * @param params The combined pagination and filter parameters.
 */
export const fetchTableData = async <TResponse>(
  endpoint: string,
  params: TableParams
): Promise<TResponse> => {
  const client = getApiClient();
  const cleanParams: Record<string, unknown> = {};

  // Merge general filters at the root level, ignoring empties/nulls
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      cleanParams[key] = value;
    }
  });

  const { data } = await client.get<TResponse>(endpoint, {
    params: cleanParams,
  });

  return data;
};
