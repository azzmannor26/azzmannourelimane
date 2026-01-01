package gestion_ecole.gestion_academique_springboot.repository;

import gestion_ecole.gestion_academique_springboot.model.Cours;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CoursRepository extends JpaRepository<Cours, Long> {

    @Query("SELECT DISTINCT c FROM Cours c LEFT JOIN FETCH c.filieres")
    List<Cours> findAllWithFilieres();

    @Query("SELECT c FROM Cours c LEFT JOIN FETCH c.filieres WHERE c.id = :id")
    Optional<Cours> findByIdWithFilieres(Long id);
}