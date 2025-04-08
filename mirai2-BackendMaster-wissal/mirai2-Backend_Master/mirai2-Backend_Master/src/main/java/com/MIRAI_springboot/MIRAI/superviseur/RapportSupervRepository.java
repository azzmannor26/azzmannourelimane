package com.MIRAI_springboot.MIRAI.superviseur;

import com.MIRAI_springboot.MIRAI.entities.Rapport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RapportSupervRepository extends JpaRepository<Rapport, Long> {
    // Find all rapports for all stagiaires assigned to a specific superviseur
    @Query("SELECT r FROM Rapport r WHERE r.stagiaire.superviseur.id = :superviseurId")
    List<Rapport> findAllBySuperviseurId(@Param("superviseurId") Long superviseurId);
}
