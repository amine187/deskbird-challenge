import { Routes } from '@angular/router';
import { Layout } from './core';
import { AuthGuard, NoAuthGuard } from './core/guards';

export const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  {
    path: 'auth',
    canActivate: [NoAuthGuard],
    loadChildren: () => import('./auth/auth.routes').then((mod) => mod.AUTH_ROUTES),
  },
  {
    path: '',
    component: Layout,
    children: [
      {
        path: 'users',
        canActivate: [AuthGuard],
        loadChildren: () => import('./user/user.routes').then((mod) => mod.USER_ROUTES),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
