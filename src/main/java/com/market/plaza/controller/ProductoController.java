package com.market.plaza.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.market.plaza.dto.HttpGlobalResponseDTO;
import com.market.plaza.dto.ProductoRequestDTO;
import com.market.plaza.dto.ProductoResponseDTO;
import com.market.plaza.service.ProductoService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/productos")
@RequiredArgsConstructor
public class ProductoController {

    private final ProductoService productoService;

    @GetMapping
    public ResponseEntity<HttpGlobalResponseDTO<List<ProductoResponseDTO>>> getAllProductos() {
        try {
            HttpGlobalResponseDTO<List<ProductoResponseDTO>> response = HttpGlobalResponseDTO.<List<ProductoResponseDTO>>builder()
                    .success(true)
                    .message("Productos obtenidos exitosamente")
                    .data(productoService.getAllProductos())
                    .build();
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            return buildErrorResponse(e);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<HttpGlobalResponseDTO<ProductoResponseDTO>> getProductoById(@PathVariable Long id) {
        try {
            HttpGlobalResponseDTO<ProductoResponseDTO> response = HttpGlobalResponseDTO.<ProductoResponseDTO>builder()
                    .success(true)
                    .message("Producto obtenido exitosamente")
                    .data(productoService.getProductoById(id))
                    .build();
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            return buildErrorResponse(e);
        }
    }

    @PostMapping
    public ResponseEntity<HttpGlobalResponseDTO<ProductoResponseDTO>> createProducto(@RequestBody ProductoRequestDTO request) {
        try {
            HttpGlobalResponseDTO<ProductoResponseDTO> response = HttpGlobalResponseDTO.<ProductoResponseDTO>builder()
                    .success(true)
                    .message("Producto creado exitosamente")
                    .data(productoService.createProducto(request))
                    .build();
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return buildErrorResponse(e);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<HttpGlobalResponseDTO<ProductoResponseDTO>> updateProducto(
            @PathVariable Long id, @RequestBody ProductoRequestDTO request) {
        try {
            HttpGlobalResponseDTO<ProductoResponseDTO> response = HttpGlobalResponseDTO.<ProductoResponseDTO>builder()
                    .success(true)
                    .message("Producto actualizado exitosamente")
                    .data(productoService.updateProducto(id, request))
                    .build();
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            return buildErrorResponse(e);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpGlobalResponseDTO<Void>> deleteProducto(@PathVariable Long id) {
        try {
            productoService.deleteProducto(id);
            HttpGlobalResponseDTO<Void> response = HttpGlobalResponseDTO.<Void>builder()
                    .success(true)
                    .message("Producto eliminado exitosamente")
                    .data(null)
                    .build();
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            return buildErrorResponse(e);
        }
    }

    private <T> ResponseEntity<HttpGlobalResponseDTO<T>> buildErrorResponse(Exception e) {
        HttpGlobalResponseDTO<T> error = HttpGlobalResponseDTO.<T>builder()
                .success(false)
                .message(e.getMessage())
                .data(null)
                .build();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

}