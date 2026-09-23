import { computed, inject, Service, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { catchError, finalize, Observable, of, tap } from 'rxjs';
import { extraerMensajeError } from '../core/utils/mensaje-error.util';
import { HttpGlobalResponseDTO } from '../models/http-global-response.dto';
import { ProductoRequestDTO, ProductoResponseDTO } from '../models/producto.dto';
import { ProductoService } from '../services/producto.service';

@Service()
export class ProductoStore {
  private readonly productoSvc = inject(ProductoService);

  private readonly productos = httpResource<HttpGlobalResponseDTO<ProductoResponseDTO[]>>(() => ({
    url: ProductoService.baseUrl,
  }));

  readonly items = computed<ProductoResponseDTO[]>(() => this.productos.value()?.data ?? []);
  readonly isLoading = this.productos.isLoading;
  readonly status = this.productos.status;
  readonly hasLoaded = computed(() => this.productos.hasValue());
  readonly error = computed<string | null>(() => {
    const err = this.productos.error();
    return err ? extraerMensajeError(err) : null;
  });

  readonly count = computed(() => this.items().length);
  readonly hasItems = computed(() => this.items().length > 0);

  reload(): void {
    this.productos.reload();
  }

  private readonly _saving = signal(false);
  readonly saving = this._saving.asReadonly();

  private readonly _mutationError = signal<string | null>(null);
  readonly mutationError = this._mutationError.asReadonly();

  create(producto: ProductoRequestDTO): Observable<HttpGlobalResponseDTO<ProductoResponseDTO> | null> {
    this._saving.set(true);
    this._mutationError.set(null);
    return this.productoSvc.create(producto).pipe(
      tap({ next: () => this.productos.reload() }),
      catchError((error: unknown) => {
        this._mutationError.set(extraerMensajeError(error));
        return of(null);
      }),
      finalize(() => this._saving.set(false))
    );
  }

  update(
    id: number,
    producto: ProductoRequestDTO
  ): Observable<HttpGlobalResponseDTO<ProductoResponseDTO> | null> {
    this._saving.set(true);
    this._mutationError.set(null);
    return this.productoSvc.update(id, producto).pipe(
      tap({ next: () => this.productos.reload() }),
      catchError((error: unknown) => {
        this._mutationError.set(extraerMensajeError(error));
        return of(null);
      }),
      finalize(() => this._saving.set(false))
    );
  }

  delete(id: number): Observable<HttpGlobalResponseDTO<null> | null> {
    this._saving.set(true);
    this._mutationError.set(null);
    return this.productoSvc.delete(id).pipe(
      tap({ next: () => this.productos.reload() }),
      catchError((error: unknown) => {
        this._mutationError.set(extraerMensajeError(error));
        return of(null);
      }),
      finalize(() => this._saving.set(false))
    );
  }
}