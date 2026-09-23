import { HttpErrorResponse } from '@angular/common/http';
import { HttpGlobalResponseDTO } from '../../models/http-global-response.dto';

export function extraerMensajeError(error: unknown): string {
  if (error instanceof HttpErrorResponse) {
    const body = error.error as Partial<HttpGlobalResponseDTO<unknown>> | null;
    if (body && typeof body.message === 'string' && body.message.trim() !== '') {
      return body.message;
    }
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Ocurrió un error inesperado';
}