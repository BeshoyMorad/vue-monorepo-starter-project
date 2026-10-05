export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id');

  const mockUsers: Record<
    string,
    { id: number | string; name: string; email: string; role: string; status: string }
  > = {
    '1': {
      id: 1,
      name: 'Admin User',
      email: 'admin@workspace.local',
      role: 'Super Admin',
      status: 'active',
    },
    '2': {
      id: 2,
      name: 'Sarah Connor',
      email: 'sarah@workspace.local',
      role: 'Security Manager',
      status: 'active',
    },
    '3': {
      id: 3,
      name: 'John Doe',
      email: 'john@workspace.local',
      role: 'Developer',
      status: 'inactive',
    },
  };

  const user = mockUsers[id || '1'] || {
    id: id || 1,
    name: `User #${id}`,
    email: `user${id}@workspace.local`,
    role: 'Member',
    status: 'active',
  };

  return user;
});
