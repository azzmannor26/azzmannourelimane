package com.MIRAI_springboot.MIRAI.intern.repository;

import com.MIRAI_springboot.MIRAI.entities.Rapport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface RapportRepository extends JpaRepository<Rapport, Integer> {

    // Find rapports assigned to a specific supervisor
    @Query("SELECT r FROM Rapport r WHERE r.superviseur.id = :supervisorId")
    List<Rapport> findBySupervisorId(@Param("supervisorId") Long supervisorId);

    // Find a specific rapport by ID, ensuring it belongs to the supervisor
    @Query("SELECT r FROM Rapport r WHERE r.id = :rapportId AND r.superviseur.id = :supervisorId")
    Optional<Rapport> findByIdAndSupervisorId(@Param("rapportId") Integer rapportId, @Param("supervisorId") Long supervisorId);
    @Query("SELECT r FROM Rapport r WHERE r.stagiaire.id = :stagiaireId")
    List<Rapport> findByStagiaireId(@Param("stagiaireId") Long stagiaireId);

}
