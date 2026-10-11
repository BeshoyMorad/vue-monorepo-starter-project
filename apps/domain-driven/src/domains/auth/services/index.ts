import type { LoginRequest, LoginResponse } from '../types';
import { api, apiRoute } from '@/api';
import type { ApiResponse } from '@workspace/core/types';

export const authServices = {
  login: async (payload: LoginRequest) => {
    const response = await api.post<ApiResponse<LoginResponse>>(apiRoute('auth.login'), payload);
    return response.data;
  },
};
