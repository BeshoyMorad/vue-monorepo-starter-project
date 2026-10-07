import { RouterView, type RouteRecordRaw } from 'vue-router';
import { usersPaths } from './users.paths';

export const usersRoutes = [
  {
    path: 'users',
    name: usersPaths.root,
    component: RouterView,
    redirect: { name: usersPaths.list },
    meta: {
      title: 'Users',
      sidebar: true,
      icon: 'hugeicons--user-group',
    },
    children: [
      {
        path: '',
        name: usersPaths.list,
        component: () => import('./pages/UsersPage.vue'),
        meta: {
          title: 'All Users',
          sidebar: true,
        },
      },
      {
        path: ':id',
        name: usersPaths.details,
        component: () => import('./pages/UserDetailsPage.vue'),
        props: true,
        meta: {
          title: 'User Details',
        },
      },
    ],
  },
] as RouteRecordRaw[];
