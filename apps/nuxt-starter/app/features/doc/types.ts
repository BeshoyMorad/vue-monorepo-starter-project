/** Row shape used by the Table and useDataTable examples. */
export interface MockUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

export type MockUserRole = 'Admin' | 'User' | 'Manager';

/** Row shape used by the useDataInfiniteScroll examples. */
export interface MockAvatarUser {
  id: number;
  name: string;
  email: string;
  role: MockUserRole;
  avatar: string;
}

/** Filters accepted by the mock user APIs. */
export interface MockUserFilters {
  role?: string;
  status?: string;
}
