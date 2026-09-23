import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';

export const productoIdGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const idParam = route.paramMap.get('id');
  const idValido = idParam !== null && /^\d+$/.test(idParam);

  if (idValido) {
    return true;
  }

  return router.createUrlTree(['/404']);
};