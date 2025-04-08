package com.MIRAI_springboot.MIRAI.superviseur;

import com.MIRAI_springboot.MIRAI.entities.stagiaire;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface StagiaireSupervRepository extends JpaRepository<stagiaire, Long> {
    List<stagiaire> findBySuperviseurId(Long superviseurId);

    @Transactional // Assure que cette méthode est dans une transaction
    @Modifying // Requis pour les opérations d'insertion ou de mise à jour
    @Query(value = "INSERT INTO stagiaire (users_id) VALUES (:id)", nativeQuery = true)
    void insertStagiaireId(@Param("id") Long id);
}
