import { computed, inject, Service, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { extraerMensajeError } from '../../../core/utils/mensaje-error.util';
import { HttpGlobalResponseDTO } from '../../../models/http-global-response.dto';
import { ProductoResponseDTO } from '../../../models/producto.dto';
import { ProductoService } from '../../../services/producto.service';

// autoProvided: false mantiene el alcance por ruta: NO se registra en el árbol de
// inyección global y se expone únicamente vía `providers: [ProductoDetalleStore]`
// en las rutas correspondientes (se crea/destruye al entrar/salir de la ruta).
@Service({ autoProvided: false })
export class ProductoDetalleStore {
  private readonly productoService = inject(ProductoService);

  private readonly _id = signal<number | null>(null);

  private readonly detalle = httpResource<HttpGlobalResponseDTO<ProductoResponseDTO>>(() => {
    const id = this._id();
    return id === null ? undefined : { url: `${ProductoService.baseUrl}/${id}` };
  });

  readonly producto = computed(() => this.detalle.value()?.data ?? null);
  readonly isLoading = this.detalle.isLoading;
  readonly error = computed<string | null>(() => {
    const err = this.detalle.error();
    return err ? extraerMensajeError(err) : null;
  });

  setId(id: number): void {
    this._id.set(id);
  }
}