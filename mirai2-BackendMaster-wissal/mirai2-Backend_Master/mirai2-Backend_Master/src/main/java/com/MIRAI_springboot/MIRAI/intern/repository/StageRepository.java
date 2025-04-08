package com.MIRAI_springboot.MIRAI.intern.repository;

import com.MIRAI_springboot.MIRAI.entities.Stage;
import com.MIRAI_springboot.MIRAI.entities.stagiaire;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StageRepository extends JpaRepository<Stage, Integer> {
    Optional<Stage> findByStagiaire(stagiaire stagiaire);
}
