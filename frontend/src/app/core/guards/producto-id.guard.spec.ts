import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  convertToParamMap,
  provideRouter,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';
import { productoIdGuard } from './producto-id.guard';

function ejecutar(id: string | null): boolean | UrlTree {
  const ruta = { paramMap: convertToParamMap(id === null ? {} : { id }) } as ActivatedRouteSnapshot;
  return TestBed.runInInjectionContext(() =>
    productoIdGuard(ruta, {} as RouterStateSnapshot)
  ) as boolean | UrlTree;
}

describe('productoIdGuard', () => {
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    router = TestBed.inject(Router);
  });

  it('permite pasar cuando :id es un número entero válido', () => {
    expect(ejecutar('5')).toBe(true);
    expect(ejecutar('123456')).toBe(true);
  });

  it('redirige a /404 cuando :id no es numérico', () => {
    const resultado = ejecutar('abc');
    expect(resultado).toBeInstanceOf(UrlTree);
    expect(router.serializeUrl(resultado as UrlTree)).toBe('/404');
  });

  it('redirige a /404 cuando :id falta en la ruta', () => {
    const resultado = ejecutar(null);
    expect(resultado).toBeInstanceOf(UrlTree);
    expect(router.serializeUrl(resultado as UrlTree)).toBe('/404');
  });

  it('redirige a /404 para ids negativos o decimales', () => {
    expect(ejecutar('-1')).toBeInstanceOf(UrlTree);
    expect(ejecutar('2.5')).toBeInstanceOf(UrlTree);
  });
});