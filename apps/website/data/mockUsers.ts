import type { TableParams } from '@workspace/core/composables';

export interface WebsiteMockUser {
  id: number;
  name: string;
  email: string;
  role: 'Admin' | 'Manager' | 'User';
  status: 'active' | 'inactive' | 'pending';
}

export interface WebsiteUserFilters {
  role?: string;
  status?: string;
}

export const MOCK_WEBSITE_USERS: WebsiteMockUser[] = [
  { id: 1, name: 'Ahmed Hassan', email: 'ahmed@example.com', role: 'Admin', status: 'active' },
  { id: 2, name: 'Sara Mohamed', email: 'sara@example.com', role: 'User', status: 'active' },
  { id: 3, name: 'Omar Ali', email: 'omar@example.com', role: 'User', status: 'inactive' },
  { id: 4, name: 'Mariam Samir', email: 'mariam@example.com', role: 'Manager', status: 'active' },
  { id: 5, name: 'Youssef Ahmed', email: 'youssef@example.com', role: 'User', status: 'pending' },
  { id: 6, name: 'Nour Khaled', email: 'nour@example.com', role: 'User', status: 'active' },
  { id: 7, name: 'Karim Mostafa', email: 'karim@example.com', role: 'Admin', status: 'inactive' },
  { id: 8, name: 'Salma Adel', email: 'salma@example.com', role: 'Manager', status: 'active' },
  { id: 9, name: 'Hassan Mahmoud', email: 'hassan@example.com', role: 'User', status: 'pending' },
  { id: 10, name: 'Layla Ibrahim', email: 'layla@example.com', role: 'Admin', status: 'active' },
  { id: 11, name: 'Tarek Ziad', email: 'tarek@example.com', role: 'User', status: 'inactive' },
  { id: 12, name: 'Dina Farouk', email: 'dina@example.com', role: 'Manager', status: 'active' },
  { id: 13, name: 'Ziad Nabil', email: 'ziad@example.com', role: 'User', status: 'active' },
  { id: 14, name: 'Rania Said', email: 'rania@example.com', role: 'User', status: 'pending' },
  { id: 15, name: 'Amr Fouad', email: 'amr@example.com', role: 'Admin', status: 'active' },
  { id: 16, name: 'Mona Yassin', email: 'mona@example.com', role: 'User', status: 'active' },
  { id: 17, name: 'Khaled Ezz', email: 'khaled@example.com', role: 'Manager', status: 'inactive' },
  { id: 18, name: 'Nadia Soliman', email: 'nadia@example.com', role: 'User', status: 'active' },
];

export const getMockWebsiteUsers = async (
  params: TableParams
): Promise<OffsetPaginatedResponse<WebsiteMockUser>> => {
  const { page = 1, limit = 5, search, role, sortKey, order } = params;

  let users = [...MOCK_WEBSITE_USERS];

  // Search filter
  const normalizedSearch = search?.trim().toLowerCase();
  if (normalizedSearch) {
    users = users.filter((user) =>
      [user.name, user.email, user.role].some((value) =>
        value.toLowerCase().includes(normalizedSearch)
      )
    );
  }

  // Role filter
  if (role && role !== 'all') {
    users = users.filter((user) => user.role === role);
  }

  // Sorting
  if (sortKey) {
    users.sort((a, b) => {
      const aValue = a[sortKey as keyof WebsiteMockUser];
      const bValue = b[sortKey as keyof WebsiteMockUser];
      if (aValue === undefined || bValue === undefined) return 0;

      const comparison = String(aValue).localeCompare(String(bValue), undefined, {
        numeric: true,
        sensitivity: 'base',
      });
      return order === 'DESC' ? -comparison : comparison;
    });
  }

  // Pagination calculation
  const totalItems = users.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));
  const start = (page - 1) * limit;
  const end = start + limit;
  const data = users.slice(start, end);

  return {
    data,
    meta: {
      totalItems,
      currentPage: page,
      itemsPerPage: limit,
      totalPages,
      hasNextPage: end < totalItems,
      hasPreviousPage: page > 1,
    },
  };
};
