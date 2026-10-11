export default defineEventHandler(() => {
  return [
    {
      id: 1,
      name: 'Admin User',
      email: 'admin@workspace.local',
      role: 'Super Admin',
      status: 'active',
    },
    {
      id: 2,
      name: 'Sarah Connor',
      email: 'sarah@workspace.local',
      role: 'Security Manager',
      status: 'active',
    },
    {
      id: 3,
      name: 'John Doe',
      email: 'john@workspace.local',
      role: 'Developer',
      status: 'inactive',
    },
  ];
});
