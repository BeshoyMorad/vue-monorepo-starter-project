import { api } from '@/api';
import type { SupplierItem } from '../types';

export const supplierApi = {
  getOverview: async () => {
    return await api.get<SupplierItem[]>('/supplier/overview');
  },
};
