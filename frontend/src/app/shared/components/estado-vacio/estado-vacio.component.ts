import { Component, input } from '@angular/core';

@Component({
  selector: 'app-estado-vacio',
  styleUrl: './estado-vacio.component.scss',
  templateUrl: './estado-vacio.component.html',
})
export class EstadoVacioComponent {
  readonly titulo = input('No hay información');
  readonly mensaje = input<string | null>(null);
}