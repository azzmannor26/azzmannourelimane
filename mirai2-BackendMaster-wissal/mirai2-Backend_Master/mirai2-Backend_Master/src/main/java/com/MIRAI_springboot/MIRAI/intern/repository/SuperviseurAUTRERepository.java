package com.MIRAI_springboot.MIRAI.intern.repository;

import com.MIRAI_springboot.MIRAI.entities.superviseur;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SuperviseurAUTRERepository extends JpaRepository<superviseur, Long> {

    // Method to find a supervisor by username
    Optional<superviseur> findByUsername(String username);
}
