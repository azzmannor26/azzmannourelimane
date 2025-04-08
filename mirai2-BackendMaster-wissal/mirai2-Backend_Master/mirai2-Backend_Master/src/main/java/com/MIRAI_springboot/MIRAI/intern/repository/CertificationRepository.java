package com.MIRAI_springboot.MIRAI.intern.repository;

import com.MIRAI_springboot.MIRAI.entities.Certification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CertificationRepository extends JpaRepository<Certification, Integer> {
    Certification findTopByStagiaire_IdOrderByIdDesc(Long stagiaireId);

    @Query("SELECT c.id, s.username, c.certificatePath, c.status " +
            "FROM Certification c JOIN c.stagiaire s")
    List<Object[]> findAllWithUsernames();

}

