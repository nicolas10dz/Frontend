import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  styleUrl: './confirm-dialog.component.scss',
  templateUrl: './confirm-dialog.component.html',
})
export class ConfirmDialogComponent {
  readonly visible = input.required<boolean>();
  readonly cargando = input(false);
  readonly confirmar = output<void>();
  readonly cancelar = output<void>();
}