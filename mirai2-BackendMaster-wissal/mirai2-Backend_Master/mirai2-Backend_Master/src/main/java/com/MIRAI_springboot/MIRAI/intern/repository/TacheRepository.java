package com.MIRAI_springboot.MIRAI.intern.repository;

import com.MIRAI_springboot.MIRAI.entities.Tache;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TacheRepository extends JpaRepository<Tache, Long> {

    // If you want to find tasks by Stagiaire ID:
    List<Tache> findByStagiaireId(Long stagiaireId);

    // If you want to find tasks by Superviseur ID:
    List<Tache> findBySuperviseurId(Long superviseurId);
    // Find tasks assigned to a specific stagiaire by a specific supervisor
    List<Tache> findByStagiaireIdAndSuperviseurId(Long stagiaireId, Long superviseurId);
}
