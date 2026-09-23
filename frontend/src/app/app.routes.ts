import { Routes } from '@angular/router';
import { productoIdGuard } from './core/guards/producto-id.guard';
import { ProductoDetalleStore } from './features/productos/stores/producto-detalle.store';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/dashboard',
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/productos/pages/producto-lista/producto-lista.component').then(
        (m) => m.ProductoListaComponent
      ),
  },
  {
    path: 'productos/nuevo',
    providers: [ProductoDetalleStore],
    loadComponent: () =>
      import('./features/productos/pages/producto-form/producto-form.component').then(
        (m) => m.ProductoFormComponent
      ),
  },
  {
    path: 'productos/:id/editar',
    canActivate: [productoIdGuard],
    providers: [ProductoDetalleStore],
    loadComponent: () =>
      import('./features/productos/pages/producto-form/producto-form.component').then(
        (m) => m.ProductoFormComponent
      ),
  },
  {
    path: 'productos/:id',
    canActivate: [productoIdGuard],
    providers: [ProductoDetalleStore],
    loadComponent: () =>
      import('./features/productos/pages/producto-detalle/producto-detalle.component').then(
        (m) => m.ProductoDetalleComponent
      ),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./shared/pages/not-found/not-found.component').then((m) => m.NotFoundComponent),
  },
];