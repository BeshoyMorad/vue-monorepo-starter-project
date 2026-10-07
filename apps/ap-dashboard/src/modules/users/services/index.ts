import { api } from '@/api';
import { config } from '@/config';
import type {
  CreateUserPayload,
  UpdateUserPayload,
  User,
  UsersPageResponse,
  UsersQuery,
  UsersResponse,
} from '@/modules/users/types';

const usersEndpoint = `${config.usersApiBaseUrl.replace(/\/$/, '')}/users`;

export const usersServices = {
  getUsers: async ({
    page,
    limit,
    search,
    sortKey,
    order,
  }: UsersQuery): Promise<UsersPageResponse> => {
    const skip = (page - 1) * limit;
    const response = await api.get<UsersResponse>(
      search?.trim() ? `${usersEndpoint}/search` : usersEndpoint,
      {
        query: {
          ...(search?.trim() ? { q: search.trim() } : {}),
          limit,
          skip,
          ...(sortKey ? { sortBy: sortKey, order: order?.toLowerCase() } : {}),
        },
      }
    );

    const totalPages = Math.ceil(response.total / limit);
    return {
      data: response.users,
      meta: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems: response.total,
        totalPages,
        hasPreviousPage: page > 1,
        hasNextPage: page < totalPages,
      },
    };
  },

  getUser: (id: number) => api.get<User>(`${usersEndpoint}/${id}`),

  createUser: (payload: CreateUserPayload) => api.post<User>(usersEndpoint, payload),

  updateUser: (id: number, payload: UpdateUserPayload) =>
    api.patch<User>(`${usersEndpoint}/${id}`, payload),

  deleteUser: (id: number) => api.delete<User>(`${usersEndpoint}/${id}`),
};
