package com.market.plaza.dto;

import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductoRequestDTO {

    private String nombre;
    private String descripcion;
    private BigDecimal precio;
    private Integer stock;
    private String categoria;  
    private String imagenUrl;
}