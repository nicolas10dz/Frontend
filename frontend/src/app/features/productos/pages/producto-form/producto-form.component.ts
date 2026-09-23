import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { form, maxLength, min, minLength, pattern, required, validate } from '@angular/forms/signals';
import { lastValueFrom } from 'rxjs';
import { HttpGlobalResponseDTO } from '../../../../models/http-global-response.dto';
import { ProductoRequestDTO, ProductoResponseDTO } from '../../../../models/producto.dto';
import { ProductoStore } from '../../../../stores/producto.store';
import { EstadoVacioComponent } from '../../../../shared/components/estado-vacio/estado-vacio.component';
import { PanelSeccionComponent } from '../../../../shared/components/panel-seccion/panel-seccion.component';
import { ProductoDetalleStore } from '../../stores/producto-detalle.store';
import { ProductoFormularioComponent } from '../../components/producto-formulario/producto-formulario.component';

@Component({
  selector: 'app-producto-form',
  imports: [RouterLink, PanelSeccionComponent, EstadoVacioComponent, ProductoFormularioComponent],
  styleUrl: './producto-form.component.scss',
  templateUrl: './producto-form.component.html',
})
export class ProductoFormComponent {
  readonly id = input<string>();

  private readonly router = inject(Router);
  protected readonly store = inject(ProductoStore);
  protected readonly detalle = inject(ProductoDetalleStore);

  readonly esEdicion = computed(() => this.id() !== undefined);
  readonly productoId = computed(() => Number(this.id()));
  readonly titulo = computed(() => (this.esEdicion() ? 'Editar producto' : 'Nuevo producto'));

  readonly cargandoEdicion = computed(() => this.esEdicion() && this.detalle.isLoading());
  readonly errorEdicion = computed(() => (this.esEdicion() ? this.detalle.error() : null));
  readonly noEncontrado = computed(
    () => this.esEdicion() && !this.detalle.isLoading() && !this.detalle.error() && !this.detalle.producto()
  );

  readonly errorGlobal = computed(() => {
    const mensaje = this.store.mutationError();
    return mensaje ? `No fue posible guardar el producto. ${mensaje}` : null;
  });

  readonly modelo = signal<ProductoRequestDTO>({
    nombre: '',
    descripcion: '',
    precio: 0,
    stock: 0,
    categoria: '',
    imagenUrl: '',
  });

  readonly f = form(this.modelo, (campo) => {
    required(campo.nombre, { message: 'El nombre es obligatorio' });
    minLength(campo.nombre, 3, { message: 'El nombre debe tener al menos 3 caracteres' });
    maxLength(campo.nombre, 120, { message: 'El nombre debe tener máximo 120 caracteres' });

    required(campo.descripcion, { message: 'La descripción es obligatoria' });
    maxLength(campo.descripcion, 500, { message: 'La descripción debe tener máximo 500 caracteres' });

    required(campo.precio, { message: 'El precio es obligatorio' });
    min(campo.precio, 0.01, { message: 'El precio debe ser mayor que 0' });
    validate(campo.precio, ({ value }) => {
      const precio = value() as number;
      if (precio > 0 && !Number.isInteger(precio * 100)) {
        return { kind: 'decimales', message: 'El precio no puede tener más de 2 decimales' };
      }
      return undefined;
    });

    required(campo.stock, { message: 'El stock es obligatorio' });
    min(campo.stock, 0, { message: 'El stock no puede ser negativo' });

    maxLength(campo.categoria, 100, { message: 'La categoría debe tener máximo 100 caracteres' });

    maxLength(campo.imagenUrl, 500, { message: 'La URL de la imagen debe tener máximo 500 caracteres' });
    pattern(campo.imagenUrl, /^https?:\/\/\S+$/i, {
      message: 'Ingresa una URL válida (http:// o https://)',
      when: ({ value }) => value() !== '',
    });
  }, {
    submission: {
      action: async () => {
        const guardado = await this.guardar();
        if (guardado) {
          this.navegarExito();
        }
        return undefined;
      },
      onInvalid: () => this.f().markAsTouched(),
    },
  });

  constructor() {
    // Último effect (justificado): sincroniza el :id de la ruta con el store de
    // detalle (alcance de ruta) y rellena el formulario cuando el producto carga.
    effect(() => {
      const id = this.id();
      if (id === undefined) {
        return;
      }
      const numeroId = Number(id);
      const cargado = this.detalle.producto();
      if (cargado === null || cargado.id !== numeroId) {
        this.detalle.setId(numeroId);
        return;
      }

      this.f.nombre().value.set(cargado.nombre);
      this.f.descripcion().value.set(cargado.descripcion);
      this.f.precio().value.set(cargado.precio);
      this.f.stock().value.set(cargado.stock);
      this.f.categoria().value.set(cargado.categoria ?? '');
      this.f.imagenUrl().value.set(cargado.imagenUrl ?? '');
    });
  }

  private async guardar(): Promise<boolean> {
    const payload: ProductoRequestDTO = { ...this.f().value() };

    let resultado: HttpGlobalResponseDTO<ProductoResponseDTO> | null;
    if (this.esEdicion()) {
      resultado = await lastValueFrom(this.store.update(this.productoId(), payload));
    } else {
      resultado = await lastValueFrom(this.store.create(payload));
    }
    return resultado !== null;
  }

  cancelar(): void {
    if (this.esEdicion()) {
      this.router.navigate(['/productos', this.productoId()]);
    } else {
      this.router.navigate(['/dashboard']);
    }
  }

  private navegarExito(): void {
    if (this.esEdicion()) {
      this.router.navigate(['/productos', this.productoId()]);
    } else {
      this.router.navigate(['/dashboard']);
    }
  }
}