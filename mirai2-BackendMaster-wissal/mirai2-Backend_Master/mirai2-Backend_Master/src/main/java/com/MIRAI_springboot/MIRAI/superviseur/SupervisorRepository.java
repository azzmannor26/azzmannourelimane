package com.MIRAI_springboot.MIRAI.superviseur;


import com.MIRAI_springboot.MIRAI.entities.stagiaire;
import com.MIRAI_springboot.MIRAI.entities.superviseur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SupervisorRepository extends JpaRepository<superviseur, Long> {

    Optional<superviseur> findById(Long id);

    // ✅ Fetch supervisor by getting `superviseur_id` from `stagiaire` table
    @Query("SELECT s FROM superviseur s WHERE s.id = (SELECT st.superviseur.id FROM stagiaire st WHERE st.id = :stagiaireId)")
    Optional<superviseur> findByStagiaireId(@Param("stagiaireId") Long stagiaireId);


    // ✅ Fetch all interns assigned to a supervisor
    @Query("SELECT st FROM stagiaire st WHERE st.superviseur.id = :supervisorId")
    List<stagiaire> findInternsBySupervisorId(@Param("supervisorId") Long supervisorId);
}



