import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../auth/services';

export const NoAuthGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isLoggedIn = authService.isLoggedIn();
  console.log('DEBUG: NoAuthGuard isLoggedIn', isLoggedIn);
  if (isLoggedIn) {
    router.navigate(['/users']);
    return false;
  }

  return true;
};
