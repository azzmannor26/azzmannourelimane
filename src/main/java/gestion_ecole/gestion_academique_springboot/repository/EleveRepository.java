package gestion_ecole.gestion_academique_springboot.repository;

import gestion_ecole.gestion_academique_springboot.model.Eleve;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EleveRepository extends JpaRepository<Eleve, Long> {
}
