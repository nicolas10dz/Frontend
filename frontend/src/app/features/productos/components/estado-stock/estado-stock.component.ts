import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-estado-stock',
  styleUrl: './estado-stock.component.scss',
  templateUrl: './estado-stock.component.html',
})
export class EstadoStockComponent {
  readonly stock = input.required<number>();

  readonly tipo = computed<'agotado' | 'bajo' | 'disponible'>(() => {
    const stock = this.stock();
    if (stock <= 0) return 'agotado';
    if (stock < 5) return 'bajo';
    return 'disponible';
  });
}