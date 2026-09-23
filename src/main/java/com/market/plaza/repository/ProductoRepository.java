package com.market.plaza.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.market.plaza.entity.Producto;
@Repository 
public interface ProductoRepository extends JpaRepository<Producto, Long> {

}
