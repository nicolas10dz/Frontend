package com.market.plaza.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO global utilizado para respuestas HTTP estandarizadas.
 *
 * @param <T> tipo de dato de la respuesta
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HttpGlobalResponseDTO<T> {

    /**
     * Indica si la operación fue exitosa.
     */
    private Boolean success;

    /**
     * Mensaje descriptivo de la respuesta.
     */
    private String message;

    /**
     * Información retornada por la petición.
     */
    private T data;

}
