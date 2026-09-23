export interface HttpGlobalResponseDTO<T> {
  success: boolean;
  message: string;
  data: T;
}