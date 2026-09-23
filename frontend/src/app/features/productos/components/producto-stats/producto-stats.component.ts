import { Component, computed, input } from '@angular/core';
import { ProductoResponseDTO } from '../../../../models/producto.dto';

@Component({
  selector: 'app-producto-stats',
  styleUrl: './producto-stats.component.scss',
  templateUrl: './producto-stats.component.html',
})
export class ProductoStatsComponent {
  readonly items = input.required<ProductoResponseDTO[]>();

  readonly count = computed(() => this.items().length);
  readonly stockTotal = computed(() => this.items().reduce((total, p) => total + (p.stock || 0), 0));
  readonly agotados = computed(() => this.items().filter((p) => p.stock <= 0).length);
  readonly valorInventario = computed(() =>
    this.items().reduce((total, p) => total + p.precio * (p.stock || 0), 0)
  );
  readonly stats = computed(() => [
    { label: 'Productos', valor: this.count() },
    { label: 'Unidades en stock', valor: this.stockTotal() },
    { label: 'Agotados', valor: this.agotados() },
    {
      label: 'Valor del inventario',
      valor: new Intl.NumberFormat('es-PE', { maximumFractionDigits: 2 }).format(
        this.valorInventario()
      ),
    },
  ]);
}