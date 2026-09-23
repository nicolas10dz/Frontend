import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, expect, it } from 'vitest';
import { ProductoResponseDTO } from '../../../../models/producto.dto';
import { ProductoCardComponent } from './producto-card.component';

const leche: ProductoResponseDTO = {
  id: 5,
  nombre: 'Leche fresca',
  descripcion: 'Envase 1L',
  precio: 5.5,
  stock: 3,
  categoria: 'Lácteos',
  imagenUrl: '',
};

async function montar(producto: ProductoResponseDTO): Promise<ComponentFixture<ProductoCardComponent>> {
  TestBed.configureTestingModule({
    imports: [ProductoCardComponent],
    providers: [provideRouter([])],
  });
  const fixture = TestBed.createComponent(ProductoCardComponent);
  fixture.componentRef.setInput('producto', producto);
  await fixture.whenStable();
  fixture.detectChanges();
  return fixture;
}

describe('ProductoCardComponent', () => {
  it('muestra nombre, categoría, precio formateado y stock', async () => {
    const f = await montar(leche);
    const texto = (f.nativeElement as HTMLElement).textContent ?? '';

    expect(texto).toContain('Leche fresca');
    expect(texto).toContain('Lácteos');
    expect(texto).toContain('5.50');
    expect(texto).toContain('3 unidades');
  });

  it('no muestra categoría cuando es vacía', async () => {
    const f = await montar({ ...leche, categoria: '' });
    const texto = (f.nativeElement as HTMLElement).textContent ?? '';

    expect(texto).not.toContain('Lácteos');
  });

  it('enlaza el botón "Ver" con la ruta /productos/:id', async () => {
    const f = await montar(leche);
    const enlace = (f.nativeElement as HTMLElement).querySelector('a.btn') as HTMLAnchorElement | null;

    expect(enlace).not.toBeNull();
    expect(enlace?.textContent?.trim()).toBe('Ver');
    expect(enlace?.getAttribute('href')).toBe('/productos/5');
  });

  it('emite el producto al pulsar Eliminar', async () => {
    const f = await montar(leche);
    const emitidos: ProductoResponseDTO[] = [];
    f.componentInstance.eliminar.subscribe((p) => emitidos.push(p));

    const boton = (f.nativeElement as HTMLElement).querySelector('.btn--peligro') as HTMLButtonElement;
    boton.click();

    expect(emitidos).toEqual([leche]);
  });
});