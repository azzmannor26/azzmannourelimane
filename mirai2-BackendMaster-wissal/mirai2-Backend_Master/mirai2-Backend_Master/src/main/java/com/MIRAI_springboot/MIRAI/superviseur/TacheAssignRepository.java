package com.MIRAI_springboot.MIRAI.superviseur;

import com.MIRAI_springboot.MIRAI.entities.Tache;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TacheAssignRepository extends JpaRepository<Tache, Long> {
    // Fetch tasks created by a specific superviseur and related to a specific stagiaire
    @Query("SELECT t FROM Tache t WHERE t.superviseur.id = :superviseurId AND t.stagiaire.id = :stagiaireId")
    List<Tache> findTasksBySuperviseurAndStagiaire(
            @Param("superviseurId") Long superviseurId,
            @Param("stagiaireId") Long stagiaireId
    );
}
