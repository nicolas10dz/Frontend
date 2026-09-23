import { Component, computed, input, output } from '@angular/core';
import { FormField, FormRoot, type FieldTree } from '@angular/forms/signals';
import { ProductoRequestDTO } from '../../../../models/producto.dto';

@Component({
  selector: 'app-producto-formulario',
  imports: [FormRoot, FormField],
  styleUrl: './producto-formulario.component.scss',
  templateUrl: './producto-formulario.component.html',
})
export class ProductoFormularioComponent {
  readonly formulario = input.required<FieldTree<ProductoRequestDTO>>();
  readonly guardando = input(false);
  readonly cancelar = output();

  readonly guardarDeshabilitado = computed(
    () => this.guardando() || this.formulario()().invalid()
  );
}