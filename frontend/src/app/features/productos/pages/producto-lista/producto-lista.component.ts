import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductoResponseDTO } from '../../../../models/producto.dto';
import { ProductoStore } from '../../../../stores/producto.store';
import { ProductoGridComponent } from '../../components/producto-grid/producto-grid.component';
import { ProductoStatsComponent } from '../../components/producto-stats/producto-stats.component';
import { ProductoFiltroComponent } from '../../components/producto-filtro/producto-filtro.component';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { EstadoVacioComponent } from '../../../../shared/components/estado-vacio/estado-vacio.component';
import { PanelSeccionComponent } from '../../../../shared/components/panel-seccion/panel-seccion.component';

@Component({
  selector: 'app-producto-lista',
  imports: [
    RouterLink,
    ProductoStatsComponent,
    ProductoGridComponent,
    ProductoFiltroComponent,
    ConfirmDialogComponent,
    EstadoVacioComponent,
    PanelSeccionComponent,
  ],
  styleUrl: './producto-lista.component.scss',
  templateUrl: './producto-lista.component.html',
})
export class ProductoListaComponent {
  protected readonly store = inject(ProductoStore);

  readonly filtro = signal('');
  readonly categoriaSel = signal('');

  private readonly _productoAEliminar = signal<ProductoResponseDTO | null>(null);
  readonly productoAEliminar = this._productoAEliminar.asReadonly();

  readonly categorias = computed(() =>
    [...new Set(this.store.items().map((p) => p.categoria).filter((c): c is string => !!c))].sort()
  );

  readonly productosFiltrados = computed(() => {
    const texto = this.filtro().trim().toLowerCase();
    const categoria = this.categoriaSel();
    return this.store.items().filter((p) => {
      const coincideTexto =
        texto === '' ||
        p.nombre.toLowerCase().includes(texto) ||
        p.descripcion.toLowerCase().includes(texto);
      const coincideCategoria = categoria === '' || p.categoria === categoria;
      return coincideTexto && coincideCategoria;
    });
  });

  solicitarEliminar(producto: ProductoResponseDTO): void {
    this._productoAEliminar.set(producto);
  }

  confirmarEliminacion(): void {
    const producto = this._productoAEliminar();
    if (!producto) return;
    this.store.delete(producto.id).subscribe();
    this._productoAEliminar.set(null);
  }

  cancelarEliminacion(): void {
    this._productoAEliminar.set(null);
  }

  limpiarFiltros(): void {
    this.filtro.set('');
    this.categoriaSel.set('');
  }
}