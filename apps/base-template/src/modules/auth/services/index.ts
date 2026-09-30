import type { LoginRequest, LoginResponse } from '@/modules/auth/types';
import { api, apiRoute } from '@/api';

export const authServices = {
  login: async (payload: LoginRequest) => {
    const response = await api.post<ApiResponse<LoginResponse>>(apiRoute('auth.login'), payload);
    return response.data;
  },
};
