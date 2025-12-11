import { Routes } from '@angular/router';
import { Dashboard } from './components';

export const USER_ROUTES: Routes = [
  { path: 'dashboard', component: Dashboard },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
];
