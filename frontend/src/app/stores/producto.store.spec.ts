import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Component, inject } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type { HttpGlobalResponseDTO } from '../models/http-global-response.dto';
import { ProductoRequestDTO, ProductoResponseDTO } from '../models/producto.dto';
import { ProductoService } from '../services/producto.service';
import { ProductoStore } from './producto.store';

@Component({
  selector: 'app-controlador',
  template: '',
})
class ControladorComponent {
  readonly store = inject(ProductoStore);
}

function respuesta<T>(data: T): HttpGlobalResponseDTO<T> {
  return { success: true, message: 'ok', data };
}

const leche: ProductoResponseDTO = {
  id: 1,
  nombre: 'Leche fresca',
  descripcion: 'Envase 1L',
  precio: 5.5,
  stock: 20,
  categoria: 'Lácteos',
  imagenUrl: '',
};

const queso: ProductoResponseDTO = {
  id: 2,
  nombre: 'Queso andino',
  descripcion: 'Pieza 250g',
  precio: 12,
  stock: 2,
  categoria: 'Lácteos',
  imagenUrl: '',
};

describe('ProductoStore (httpResource)', () => {
  let store: ProductoStore;
  let http: HttpTestingController;
  let fixture: ComponentFixture<ControladorComponent>;

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    store = TestBed.inject(ProductoStore);
    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(ControladorComponent);
  });

  afterEach(() => {
    http.verify();
  });

  async function bombeo(): Promise<void> {
    fixture.detectChanges();
    await new Promise<void>((resolve) => setTimeout(resolve, 10));
    await new Promise<void>((resolve) => setTimeout(resolve, 10));
  }

  it('arranca en Loading y al resolver actualiza items y computed (proceso real de httpResource)', async () => {
    expect(store.items()).toEqual([]);
    expect(store.hasLoaded()).toBe(false);
    await bombeo();

    expect(store.isLoading()).toBe(true);
    expect(store.status()).toBe('loading');

    const peticion = http.expectOne(ProductoService.baseUrl);
    expect(peticion.request.method).toBe('GET');
    peticion.flush(respuesta([leche, queso]));

    await bombeo();

    expect(store.isLoading()).toBe(false);
    expect(store.hasLoaded()).toBe(true);
    expect(store.status()).toBe('resolved');
    expect(store.items()).toEqual([leche, queso]);
    expect(store.count()).toBe(2);
    expect(store.hasItems()).toBe(true);
    expect(store.error()).toBeNull();
  });

  it('captura el error HTTP en state error sin items', async () => {
    expect(store.items()).toEqual([]);
    await bombeo();

    const peticion = http.expectOne(ProductoService.baseUrl);
    peticion.flush(
      { success: false, message: 'base de datos caída', data: null },
      { status: 500, statusText: 'Error' }
    );

    await bombeo();

    expect(store.isLoading()).toBe(false);
    expect(store.hasLoaded()).toBe(false);
    expect(store.status()).toBe('error');
    expect(store.error()).toContain('base de datos caída');
  });

  it('create marca saving, avisa reload y refresca la lista al completar', async () => {
    expect(store.items()).toEqual([]);
    await bombeo();
    http.expectOne(ProductoService.baseUrl).flush(respuesta([leche]));

    let resultado: HttpGlobalResponseDTO<ProductoResponseDTO> | null | undefined;
    store.create(leche).subscribe((r) => (resultado = r));
    expect(store.saving()).toBe(true);
    await bombeo();

    const post = http.expectOne(ProductoService.baseUrl);
    expect(post.request.method).toBe('POST');
    post.flush(respuesta(leche));
    expect(store.saving()).toBe(false);

    await bombeo();
    const get = http.expectOne(ProductoService.baseUrl);
    get.flush(respuesta([leche, queso]));

    await bombeo();

    expect(resultado).not.toBeNull();
    expect(store.mutationError()).toBeNull();
    expect(store.items()).toEqual([leche, queso]);
    expect(store.count()).toBe(2);
  });

  it('delete elimina en el backend y refresca la lista sin el registro', async () => {
    expect(store.items()).toEqual([]);
    await bombeo();
    http.expectOne(ProductoService.baseUrl).flush(respuesta([leche, queso]));

    store.delete(1).subscribe();
    expect(store.saving()).toBe(true);
    await bombeo();

    const del = http.expectOne(`${ProductoService.baseUrl}/1`);
    expect(del.request.method).toBe('DELETE');
    del.flush(respuesta(null));
    expect(store.saving()).toBe(false);

    await bombeo();
    const get = http.expectOne(ProductoService.baseUrl);
    get.flush(respuesta([queso]));

    await bombeo();

    expect(store.items()).toEqual([queso]);
    expect(store.count()).toBe(1);
    expect(store.hasItems()).toBe(true);
    expect(store.mutationError()).toBeNull();
  });

  it('create fallido expone mutationError y termina saving', async () => {
    expect(store.items()).toEqual([]);
    await bombeo();
    http.expectOne(ProductoService.baseUrl).flush(respuesta([]));

    let resultado: HttpGlobalResponseDTO<ProductoResponseDTO> | null | undefined = undefined;
    store.create(leche).subscribe((r) => (resultado = r));
    await bombeo();

    const post = http.expectOne(ProductoService.baseUrl);
    post.flush(
      { success: false, message: 'ya existe un producto con ese nombre', data: null },
      { status: 409, statusText: 'Conflict' }
    );

    await bombeo();

    expect(resultado).toBeNull();
    expect(store.saving()).toBe(false);
    expect(store.mutationError()).toContain('ya existe un producto con ese nombre');
    expect(store.isLoading()).toBe(false);
  });

  it('update fallido también expone mutationError (operaciones de mutación reales)', async () => {
    expect(store.items()).toEqual([]);
    await bombeo();
    http.expectOne(ProductoService.baseUrl).flush(respuesta([]));

    const parcial: ProductoRequestDTO = {
      nombre: 'Queso andino',
      descripcion: 'Pieza 250g',
      precio: 12,
      stock: 2,
      categoria: 'Lácteos',
      imagenUrl: '',
    };
    store.update(2, parcial).subscribe();
    await bombeo();

    const put = http.expectOne(`${ProductoService.baseUrl}/2`);
    put.flush(
      { success: false, message: 'precio inválido', data: null },
      { status: 422, statusText: 'Unprocessable Entity' }
    );

    await bombeo();

    expect(store.saving()).toBe(false);
    expect(store.mutationError()).toContain('precio inválido');
  });
});