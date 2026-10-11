import { api } from '@/api';
import type { AdminItem } from '../types';

export const adminApi = {
  getOverview: async () => {
    return await api.get<AdminItem[]>('/admin/overview');
  },
};
