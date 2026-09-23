import { provideHttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type { HttpGlobalResponseDTO } from '../models/http-global-response.dto';
import { ProductoRequestDTO, ProductoResponseDTO } from '../models/producto.dto';
import { ProductoService } from './producto.service';

function response<T>(data: T, success = true, message = 'ok'): HttpGlobalResponseDTO<T> {
  return { success, message, data };
}

describe('ProductoService (HTTP real)', () => {
  let service: ProductoService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ProductoService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  const payload: ProductoRequestDTO = {
    nombre: 'Leche fresca',
    descripcion: 'Envase 1L',
    precio: 5.5,
    stock: 20,
    categoria: 'Lácteos',
    imagenUrl: 'https://ejemplo.com/leche.jpg',
  };

  it('GET /productos devuelve la lista', () => {
    const productos: ProductoResponseDTO[] = [{ id: 1, ...payload }];

    service.getAll().subscribe((respuesta) => {
      expect(respuesta).toEqual(response(productos));
    });

    const peticion = http.expectOne(ProductoService.baseUrl);
    expect(peticion.request.method).toBe('GET');
    peticion.flush(response(productos));
  });

  it('POST /productos envía el payload con el método correcto', () => {
    const creado: ProductoResponseDTO = { id: 9, ...payload };

    service.create(payload).subscribe((respuesta) => {
      expect(respuesta.data).toEqual(creado);
    });

    const peticion = http.expectOne(ProductoService.baseUrl);
    expect(peticion.request.method).toBe('POST');
    expect(peticion.request.body).toEqual(payload);
    peticion.flush(response(creado));
  });

  it('PUT /productos/:id usa URL y payload reales', () => {
    const actualizado: ProductoResponseDTO = { id: 7, ...payload, stock: 4 };

    service.update(7, payload).subscribe((respuesta) => {
      expect(respuesta.data).toEqual(actualizado);
    });

    const peticion = http.expectOne(`${ProductoService.baseUrl}/7`);
    expect(peticion.request.method).toBe('PUT');
    expect(peticion.request.body).toEqual(payload);
    peticion.flush(response(actualizado));
  });

  it('DELETE /productos/:id usa el método DELETE', () => {
    service.delete(3).subscribe();

    const peticion = http.expectOne(`${ProductoService.baseUrl}/3`);
    expect(peticion.request.method).toBe('DELETE');
    peticion.flush(response(null));
  });

  it('propaga el error HTTP del backend (400)', () => {
    const errores: number[] = [];

    service.create(payload).subscribe({ error: (e: HttpErrorResponse) => errores.push(e.status) });

    const peticion = http.expectOne(ProductoService.baseUrl);
    peticion.flush(
      { success: false, message: 'nombre es requerido', data: null },
      { status: 400, statusText: 'Bad Request' }
    );

    expect(errores).toEqual([400]);
  });
});