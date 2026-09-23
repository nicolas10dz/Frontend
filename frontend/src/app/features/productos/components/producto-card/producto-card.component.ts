import { Component, computed, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductoResponseDTO } from '../../../../models/producto.dto';
import { EstadoStockComponent } from '../estado-stock/estado-stock.component';

@Component({
  selector: 'app-producto-card',
  imports: [EstadoStockComponent, RouterLink],
  styleUrl: './producto-card.component.scss',
  templateUrl: './producto-card.component.html',
})
export class ProductoCardComponent {
  readonly producto = input.required<ProductoResponseDTO>();
  readonly eliminar = output<ProductoResponseDTO>();

  readonly precioFormateado = computed(() =>
    new Intl.NumberFormat('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
      this.producto().precio
    )
  );
}