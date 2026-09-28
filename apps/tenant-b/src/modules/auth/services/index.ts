import type { LoginRequest, LoginResponse } from '@/modules/auth/types';
import { api } from '@workspace/core/lib/api/client';
import { apiRoute } from '@workspace/core/lib/api/endpoints';

export const authServices = {
  login: async (payload: LoginRequest) => {
    const response = await api.post<ApiResponse<LoginResponse>>(apiRoute('auth.login'), payload);
    return response.data;
  },
};
