import { Component, input, model } from '@angular/core';

@Component({
  selector: 'app-producto-filtro',
  styleUrl: './producto-filtro.component.scss',
  templateUrl: './producto-filtro.component.html',
})
export class ProductoFiltroComponent {
  // model(): permite enlace bidireccional con el contenedor; el texto/categoría
  // los posee el padre (para derivar la lista filtrada) y este componente los edita.
  readonly busqueda = model<string>('');
  readonly categoria = model<string>('');

  readonly categorias = input<string[]>([]);
}