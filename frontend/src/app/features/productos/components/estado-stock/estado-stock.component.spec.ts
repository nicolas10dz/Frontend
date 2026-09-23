import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { EstadoStockComponent } from './estado-stock.component';

beforeEach(() => {
  TestBed.configureTestingModule({ imports: [EstadoStockComponent] });
});

async function montar(stock: number): Promise<ComponentFixture<EstadoStockComponent>> {
  const fixture = TestBed.createComponent(EstadoStockComponent);
  fixture.componentRef.setInput('stock', stock);
  await fixture.whenStable();
  fixture.detectChanges();
  return fixture;
}

describe('EstadoStockComponent', () => {
  it('tipo() clasifica agotado con stock <= 0', async () => {
    const f = await montar(0);
    expect(f.componentInstance.tipo()).toBe('agotado');
  });

  it('tipo() clasifica bajo con stock entre 1 y 4', async () => {
    expect((await montar(1)).componentInstance.tipo()).toBe('bajo');
    expect((await montar(4)).componentInstance.tipo()).toBe('bajo');
  });

  it('tipo() clasifica disponible con stock >= 5', async () => {
    expect((await montar(5)).componentInstance.tipo()).toBe('disponible');
    expect((await montar(20)).componentInstance.tipo()).toBe('disponible');
  });

  it('muestra la insignia "Agotado" cuando no hay stock', async () => {
    const f = await montar(0);
    expect(f.nativeElement.textContent).toContain('Agotado');
  });

  it('muestra la insignia "Stock bajo" para stock reducido', async () => {
    const f = await montar(3);
    expect(f.nativeElement.textContent).toContain('Stock bajo');
  });

  it('muestra la insignia "Disponible" para stock suficiente', async () => {
    const f = await montar(8);
    expect(f.nativeElement.textContent).toContain('Disponible');
  });
});