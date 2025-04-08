package com.MIRAI_springboot.MIRAI.RH1;

import com.MIRAI_springboot.MIRAI.entities.Candidature;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface CandidatureRepository extends JpaRepository<Candidature, Long> {
    Optional<Candidature> findByUserId(Long userId);



    @Query("SELECT c.id, u.username, c.cv, c.degree, c.lettremotivation, c.dureedestage, c.typeinternship, c.statut " +
            "FROM Candidature c JOIN c.user u")
    List<Object[]> findAllWithUsernames();
}
