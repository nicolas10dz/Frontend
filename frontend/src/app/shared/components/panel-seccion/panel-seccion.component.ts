import { Component, input } from '@angular/core';

@Component({
  selector: 'app-panel-seccion',
  styleUrl: './panel-seccion.component.scss',
  templateUrl: './panel-seccion.component.html',
})
export class PanelSeccionComponent {
  readonly titulo = input<string>('');
}