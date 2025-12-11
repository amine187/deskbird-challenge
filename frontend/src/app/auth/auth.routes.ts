import { Routes } from '@angular/router';
import { Login } from './components';

export const AUTH_ROUTES: Routes = [
  { path: 'login', component: Login },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];
