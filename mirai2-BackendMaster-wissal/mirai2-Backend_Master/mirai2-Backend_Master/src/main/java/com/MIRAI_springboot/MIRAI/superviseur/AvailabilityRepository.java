package com.MIRAI_springboot.MIRAI.superviseur;

import com.MIRAI_springboot.MIRAI.entities.Availability;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AvailabilityRepository extends JpaRepository<Availability, Long> {
    @Query("SELECT a FROM Availability a WHERE a.superviseur.id = :superviseurId")
    List<Availability> findBySuperviseurId(@Param("superviseurId") Long superviseurId);

    // Query to get all availabilities with supervisor IDs
    @Query("SELECT a.id, a.description, a.startDate, a.endDate, a.superviseur.id FROM Availability a")
    List<Object[]> findAllSupervisorsAvailabilities();


}
