import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { type FieldTree, submit } from '@angular/forms/signals';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { HttpGlobalResponseDTO } from '../../../../models/http-global-response.dto';
import { ProductoRequestDTO, ProductoResponseDTO } from '../../../../models/producto.dto';
import { ProductoDetalleStore } from '../../stores/producto-detalle.store';
import { ProductoStore } from '../../../../stores/producto.store';
import { ProductoFormComponent } from './producto-form.component';

const leche: ProductoResponseDTO = {
  id: 1,
  nombre: 'Leche fresca',
  descripcion: 'Envase de 1 litro',
  precio: 5.5,
  stock: 20,
  categoria: 'Lácteos',
  imagenUrl: 'https://ejemplo.com/leche.jpg',
};

@Component({
  selector: 'app-vista-dummy',
  template: '',
})
class VistaDummyComponent {}

const rutas = [
  { path: 'dashboard', component: VistaDummyComponent },
  { path: 'productos', component: VistaDummyComponent },
];

const enJuego = {
  fixture: undefined as unknown as ComponentFixture<ProductoFormComponent>,
  store: undefined as unknown as ProductoStore,
};

function configurar(): void {
  TestBed.resetTestingModule();
  const storeMock = {
    saving: signal(false),
    mutationError: signal<string | null>(null),
    create: vi.fn(() => of({ success: true, message: 'ok', data: leche } as HttpGlobalResponseDTO<ProductoResponseDTO>)),
    update: vi.fn(() => of({ success: true, message: 'ok', data: leche } as HttpGlobalResponseDTO<ProductoResponseDTO>)),
    reload: () => undefined,
  } as unknown as ProductoStore;

  const detalleMock = {
    producto: signal<ProductoResponseDTO | null>(null),
    isLoading: signal(false),
    error: signal<string | null>(null),
    setId: vi.fn(),
  } as unknown as ProductoDetalleStore;

  TestBed.configureTestingModule({
    imports: [ProductoFormComponent],
    providers: [
      provideRouter(rutas),
      { provide: ProductoStore, useValue: storeMock },
      { provide: ProductoDetalleStore, useValue: detalleMock },
    ],
  });

  const fixture = TestBed.createComponent(ProductoFormComponent);
  enJuego.fixture = fixture;
  enJuego.store = storeMock;
}

async function montar(): Promise<ComponentFixture<ProductoFormComponent>> {
  configurar();
  const fixture = enJuego.fixture;
  await fixture.whenStable();
  fixture.detectChanges();
  enJuego.fixture = fixture;
  return fixture;
}

function llenar(f: FieldTree<ProductoRequestDTO>): void {
  f.nombre().value.set('Leche fresca');
  f.descripcion().value.set('Envase de 1 litro');
  f.precio().value.set(5.5);
  f.stock().value.set(20);
  f.categoria().value.set('Lácteos');
  f.imagenUrl().value.set('https://ejemplo.com/leche.jpg');
}

describe('ProductoFormComponent (Signal Forms)', () => {
  beforeEach(() => {
    configurar();
  });

  it('arranca en modo crear con el formulario vacío e inválido', async () => {
    const fixture = enJuego.fixture;
    fixture.detectChanges();

    const f: FieldTree<ProductoRequestDTO> = fixture.componentInstance.f;
    const estado = f();

    expect(fixture.componentInstance.esEdicion()).toBe(false);
    expect(fixture.componentInstance.titulo()).toBe('Nuevo producto');
    expect(estado.value()).toEqual({
      nombre: '',
      descripcion: '',
      precio: 0,
      stock: 0,
      categoria: '',
      imagenUrl: '',
    });
    expect(estado.invalid()).toBe(true);
    expect(estado.valid()).toBe(false);
    expect(f.nombre().invalid()).toBe(true);
  });

  it('exige el nombre (required)', async () => {
    const f = enJuego.fixture.componentInstance.f;
    llenar(f);
    f.nombre().value.set('');

    expect(f.nombre().invalid()).toBe(true);
    expect(f.nombre().errors().map((e) => e.kind)).toContain('required');
    expect(f.nombre().errors().map((e) => e.message)).toContain('El nombre es obligatorio');
  });

  it('valida que el precio sea mayor que 0 (min)', async () => {
    const f = enJuego.fixture.componentInstance.f;
    f.precio().value.set(0);
    expect(f.precio().invalid()).toBe(true);
    expect(f.precio().errors().map((e) => e.kind)).toContain('min');

    f.precio().value.set(0.5);
    expect(f.precio().valid()).toBe(true);
  });

  it('valida que el precio no tenga más de 2 decimales', async () => {
    const f = enJuego.fixture.componentInstance.f;
    f.precio().value.set(1.234);
    expect(f.precio().invalid()).toBe(true);
    expect(f.precio().errors().map((e) => e.kind)).toContain('decimales');

    f.precio().value.set(1.5);
    expect(f.precio().valid()).toBe(true);
  });

  it('es válido cuando todos los campos cumplen las reglas', async () => {
    const f = enJuego.fixture.componentInstance.f;
    llenar(f);
    expect(f().valid()).toBe(true);
    expect(f().invalid()).toBe(false);
  });

  it('al enviar un formulario inválido no llama a create y marca los campos como tocados', async () => {
    const fixture = enJuego.fixture;
    fixture.detectChanges();

    const f = fixture.componentInstance.f;
    const resultado = await submit(f);

    expect(resultado).toBe(false);
    expect(enJuego.store.create).not.toHaveBeenCalled();
    expect(f.nombre().touched()).toBe(true);
    expect(f.imagenUrl().touched()).toBe(true);
  });

  it('envía un formulario válido al backend vía store.create', async () => {
    const fixture = enJuego.fixture;
    fixture.detectChanges();

    const f = fixture.componentInstance.f;
    llenar(f);
    const resultado = await submit(f);

    expect(resultado).not.toBe(false);
    expect(enJuego.store.create).toHaveBeenCalledTimes(1);
    const payload = (enJuego.store.create as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(payload).toEqual({
      nombre: 'Leche fresca',
      descripcion: 'Envase de 1 litro',
      precio: 5.5,
      stock: 20,
      categoria: 'Lácteos',
      imagenUrl: 'https://ejemplo.com/leche.jpg',
    });
  });
});