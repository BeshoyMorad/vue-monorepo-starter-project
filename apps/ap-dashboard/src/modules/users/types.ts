export interface User {
  id: number;
  firstName: string;
  lastName: string;
  maidenName?: string;
  age?: number;
  gender?: string;
  email: string;
  phone?: string;
  username: string;
  color?: string;
  birthDate?: string;
  image?: string;
  [key: string]: unknown;
}

export interface UsersResponse {
  users: User[];
  total: number;
  skip: number;
  limit: number;
}

export interface UsersQuery {
  page: number;
  limit: number;
  search?: string;
  sortKey?: string;
  order?: 'ASC' | 'DESC';
}

export type UsersPageResponse = OffsetPaginatedResponse<User>;

export interface ApiDataTableHandle<TRow extends { id: number | string }> {
  refresh: () => Promise<void>;
  addRow: (row: TRow) => void;
  upsertRow: (row: TRow) => void;
  removeRow: (id: TRow['id']) => void;
}

export interface CreateUserPayload {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  phone?: string;
  color?: string;
}

export type UpdateUserPayload = Partial<CreateUserPayload>;
