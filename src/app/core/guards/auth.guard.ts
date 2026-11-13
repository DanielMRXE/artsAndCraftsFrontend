import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const sellerGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isSellerOrAdmin()) {
    return true;
  }

  router.navigate(['/login'], { queryParams: { returnUrl: '/panel-taller' } });
  return false;
};
