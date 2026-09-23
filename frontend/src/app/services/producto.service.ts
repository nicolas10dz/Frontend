import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpGlobalResponseDTO } from '../models/http-global-response.dto';
import { ProductoRequestDTO, ProductoResponseDTO } from '../models/producto.dto';

@Service()
export class ProductoService {
  static readonly baseUrl = `${environment.apiUrl}/productos`;

  private readonly http = inject(HttpClient);

  getAll(): Observable<HttpGlobalResponseDTO<ProductoResponseDTO[]>> {
    return this.http.get<HttpGlobalResponseDTO<ProductoResponseDTO[]>>(ProductoService.baseUrl);
  }

  getById(id: number): Observable<HttpGlobalResponseDTO<ProductoResponseDTO>> {
    return this.http.get<HttpGlobalResponseDTO<ProductoResponseDTO>>(`${ProductoService.baseUrl}/${id}`);
  }

  create(producto: ProductoRequestDTO): Observable<HttpGlobalResponseDTO<ProductoResponseDTO>> {
    return this.http.post<HttpGlobalResponseDTO<ProductoResponseDTO>>(ProductoService.baseUrl, producto);
  }

  update(id: number, producto: ProductoRequestDTO): Observable<HttpGlobalResponseDTO<ProductoResponseDTO>> {
    return this.http.put<HttpGlobalResponseDTO<ProductoResponseDTO>>(
      `${ProductoService.baseUrl}/${id}`,
      producto
    );
  }

  delete(id: number): Observable<HttpGlobalResponseDTO<null>> {
    return this.http.delete<HttpGlobalResponseDTO<null>>(`${ProductoService.baseUrl}/${id}`);
  }
}