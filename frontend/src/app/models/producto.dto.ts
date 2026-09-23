export interface ProductoResponseDTO {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoria: string;
  imagenUrl: string;
}

export interface ProductoRequestDTO {
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoria: string;
  imagenUrl: string;
}