package com.MIRAI_springboot.MIRAI.intern.repository;

import com.MIRAI_springboot.MIRAI.entities.stagiaire;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StagiaireRepository extends JpaRepository<stagiaire, Long> {
    boolean existsByEmail(String email);
}
