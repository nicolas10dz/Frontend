package com.market.plaza.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.market.plaza.dto.ProductoRequestDTO;
import com.market.plaza.dto.ProductoResponseDTO;
import com.market.plaza.entity.Producto;
import com.market.plaza.repository.ProductoRepository;

@Service
public class ProductoService {

    private final ProductoRepository productoRepository;

    public ProductoService(ProductoRepository productoRepository) {
        this.productoRepository = productoRepository;
    }

    public ProductoResponseDTO createProducto(ProductoRequestDTO request) {
        Producto producto = new Producto();
        producto.setNombre(request.getNombre());
        producto.setDescripcion(request.getDescripcion());
        producto.setPrecio(request.getPrecio());
        producto.setStock(request.getStock());
        producto.setCategoria(request.getCategoria());
        producto.setImagenUrl(request.getImagenUrl());
        return toResponse(productoRepository.save(producto));
    }

    public List<ProductoResponseDTO> getAllProductos() {
        return productoRepository.findAll().stream().map(this::toResponse).toList();
    }

    public ProductoResponseDTO getProductoById(Long id) {
        return toResponse(getProducto(id));
    }

    public ProductoResponseDTO updateProducto(Long id, ProductoRequestDTO request) {
        Producto producto = getProducto(id);
        producto.setNombre(request.getNombre());
        producto.setDescripcion(request.getDescripcion());
        producto.setPrecio(request.getPrecio());
        producto.setStock(request.getStock());
        producto.setCategoria(request.getCategoria());
        producto.setImagenUrl(request.getImagenUrl());
        return toResponse(productoRepository.save(producto));
    }

    public void deleteProducto(Long id) {
        productoRepository.delete(getProducto(id));
    }

    private Producto getProducto(Long id) {
        return productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con id: " + id));
    }

    private ProductoResponseDTO toResponse(Producto producto) {
        return ProductoResponseDTO.builder()
                .id(producto.getId())
                .nombre(producto.getNombre())
                .descripcion(producto.getDescripcion())
                .precio(producto.getPrecio())
                .stock(producto.getStock())
                .categoria(producto.getCategoria())
                .imagenUrl(producto.getImagenUrl())
                .build();
    }
}