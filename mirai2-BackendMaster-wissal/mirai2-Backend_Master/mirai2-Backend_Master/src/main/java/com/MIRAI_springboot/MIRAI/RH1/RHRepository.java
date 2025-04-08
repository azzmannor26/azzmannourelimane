package com.MIRAI_springboot.MIRAI.RH1;


import com.MIRAI_springboot.MIRAI.entities.ENUMS.UserRole;
import com.MIRAI_springboot.MIRAI.entities.RH;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RHRepository extends JpaRepository<RH, Long> {

    @Query("SELECT u.username, u.email, u.departement, s.poste " +
            "FROM superviseur s JOIN User u ON s.id = u.id")
    List<Object[]> findAllSupervisorsWithDetails();

    @Query("SELECT u.id, u.username, u.email, u.departement, s.poste\n" +
            "FROM superviseur s\n" +
            "JOIN User u ON s.id = u.id")
    List<Object[]> findAllSupervisorsWithid();

    }

