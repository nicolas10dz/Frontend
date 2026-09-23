import { Component, effect, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EstadoVacioComponent } from '../../../../shared/components/estado-vacio/estado-vacio.component';
import { PanelSeccionComponent } from '../../../../shared/components/panel-seccion/panel-seccion.component';
import { EstadoStockComponent } from '../../components/estado-stock/estado-stock.component';
import { ProductoDetalleStore } from '../../stores/producto-detalle.store';

@Component({
  selector: 'app-producto-detalle',
  imports: [RouterLink, EstadoVacioComponent, PanelSeccionComponent, EstadoStockComponent],
  styleUrl: './producto-detalle.component.scss',
  templateUrl: './producto-detalle.component.html',
})
export class ProductoDetalleComponent {
  readonly id = input.required<string>();
  protected readonly store = inject(ProductoDetalleStore);

  constructor() {
    // effect (único, justificado): sincroniza el parámetro de ruta (:id) con el
    // store de alcance de ruta para re-disparar la carga reactiva del producto.
    effect(() => {
      const valor = Number(this.id());
      if (Number.isInteger(valor) && valor > 0) {
        this.store.setId(valor);
      }
    });
  }

  formatearPrecio(precio: number): string {
    return new Intl.NumberFormat('es-PE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(precio);
  }
}