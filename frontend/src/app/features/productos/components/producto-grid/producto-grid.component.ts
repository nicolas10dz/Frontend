import { Component, input, output } from '@angular/core';
import { ProductoResponseDTO } from '../../../../models/producto.dto';
import { ProductoCardComponent } from '../producto-card/producto-card.component';

@Component({
  selector: 'app-producto-grid',
  imports: [ProductoCardComponent],
  styleUrl: './producto-grid.component.scss',
  templateUrl: './producto-grid.component.html',
})
export class ProductoGridComponent {
  readonly items = input.required<ProductoResponseDTO[]>();
  readonly eliminar = output<ProductoResponseDTO>();
}