import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { computed, signal } from '@angular/core';
import { of } from 'rxjs';
import { describe, expect, it } from 'vitest';
import { ProductoResponseDTO } from '../../../../models/producto.dto';
import { ProductoStore } from '../../../../stores/producto.store';
import { ProductoListaComponent } from './producto-lista.component';

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

interface EstadoMock {
  items?: ProductoResponseDTO[];
  isLoading?: boolean;
  hasLoaded?: boolean;
  error?: string | null;
  mutationError?: string | null;
  saving?: boolean;
}

function mockStore(e: EstadoMock): ProductoStore {
  const items = signal(e.items ?? []);
  const mock = {
    items,
    isLoading: signal(e.isLoading ?? false),
    hasLoaded: signal(e.hasLoaded ?? false),
    error: signal(e.error ?? null),
    mutationError: signal(e.mutationError ?? null),
    saving: signal(e.saving ?? false),
    hasItems: computed(() => items().length > 0),
    reload: () => undefined,
    delete: () => of(null),
  };
  return mock as unknown as ProductoStore;
}

async function montar(e: EstadoMock): Promise<ComponentFixture<ProductoListaComponent>> {
  TestBed.resetTestingModule();
  TestBed.configureTestingModule({
    imports: [ProductoListaComponent],
    providers: [provideRouter([]), { provide: ProductoStore, useValue: mockStore(e) }],
  });
  const fixture = TestBed.createComponent(ProductoListaComponent);
  await fixture.whenStable();
  fixture.detectChanges();
  return fixture;
}

describe('ProductoListaComponent', () => {
  it('muestra el estado de carga inicial', async () => {
    const f = await montar({ isLoading: true, hasLoaded: false });
    const texto = (f.nativeElement as HTMLElement).textContent ?? '';
    expect(texto).toContain('Cargando productos…');
  });

  it('muestra el mensaje de error del backend con botón Reintentar', async () => {
    const f = await montar({ isLoading: false, hasLoaded: false, error: 'servicio no disponible' });
    const texto = (f.nativeElement as HTMLElement).textContent ?? '';
    expect(texto).toContain('No se pudieron cargar los productos');
    expect(texto).toContain('servicio no disponible');
    expect(texto).toContain('Reintentar');
  });

  it('muestra el estado vacío cuando no hay productos', async () => {
    const f = await montar({ isLoading: false, hasLoaded: true, items: [] });
    const texto = (f.nativeElement as HTMLElement).textContent ?? '';
    expect(texto).toContain('Aún no hay productos');
  });

  it('renderiza la lista de productos y deriva las categorías', async () => {
    const f = await montar({ isLoading: false, hasLoaded: true, items: [leche, queso] });
    const texto = (f.nativeElement as HTMLElement).textContent ?? '';

    expect(texto).toContain('Leche fresca');
    expect(texto).toContain('Queso andino');
    expect(f.componentInstance.categorias()).toEqual(['Lácteos']);
  });

  it('filtra la lista por texto sin afectar el store', async () => {
    const f = await montar({ isLoading: false, hasLoaded: true, items: [leche, queso] });
    expect(f.componentInstance.productosFiltrados().length).toBe(2);

    f.componentInstance.filtro.set('queso');
    f.detectChanges();

    expect(f.componentInstance.productosFiltrados()).toEqual([queso]);
    const texto = (f.nativeElement as HTMLElement).textContent ?? '';
    expect(texto).toContain('Queso andino');
    expect(texto).not.toContain('Leche fresca');
  });

  it('muestra "Sin resultados" cuando ningún producto coincide', async () => {
    const f = await montar({ isLoading: false, hasLoaded: true, items: [leche, queso] });

    f.componentInstance.filtro.set('inexistente');
    f.detectChanges();

    const texto = (f.nativeElement as HTMLElement).textContent ?? '';
    expect(texto).toContain('Sin resultados');
    expect(texto).toContain('Limpiar filtros');
  });

  it('muestra el error de mutación como alerta sobre la lista cargada', async () => {
    const f = await montar({
      isLoading: false,
      hasLoaded: true,
      items: [leche],
      mutationError: 'no se pudo eliminar el producto',
    });
    const texto = (f.nativeElement as HTMLElement).textContent ?? '';
    expect(texto).toContain('no se pudo eliminar el producto');
  });
});