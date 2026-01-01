package gestion_ecole.gestion_academique_springboot.repository;

import gestion_ecole.gestion_academique_springboot.model.DossierAdministratif;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface DossierAdministratifRepository extends JpaRepository<DossierAdministratif, Long> {

    //Ça sert à récupérer tous les dossiers AVEC leurs élèves ET les filières des élèves en UNE SEULE REQUÊTE.
    @Query("SELECT DISTINCT d FROM DossierAdministratif d LEFT JOIN FETCH d.eleve e LEFT JOIN FETCH e.filiere")
    List<DossierAdministratif> findAllWithEleves();

    //Ça sert à récupérer UN dossier par son ID AVEC son élève ET la filière de l'élève en UNE SEULE REQUÊTE.
    @Query("SELECT d FROM DossierAdministratif d LEFT JOIN FETCH d.eleve e LEFT JOIN FETCH e.filiere WHERE d.id = :id")
    Optional<DossierAdministratif> findByIdWithEleve(Long id);
}