package com.MIRAI_springboot.MIRAI.RH1;

import com.MIRAI_springboot.MIRAI.entities.Stage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StageRepository2 extends JpaRepository<Stage, Long> {

    @Query("SELECT s.id, s.contractStatus, s.dateDebut, s.dateFin, s.departement, s.isPaid, s.location, s.stipend, s.sujet, " +
            "sup.username AS superviseurName, stg.username AS stagiaireName " +
            "FROM Stage s " +
            "JOIN User sup ON s.id = sup.id " +
            "JOIN User stg ON s.stagiaire.id = stg.id")
    List<Object[]> findAllInternshipsWithDetails();
}
