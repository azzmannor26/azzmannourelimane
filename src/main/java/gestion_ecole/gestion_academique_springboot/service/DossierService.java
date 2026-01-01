package gestion_ecole.gestion_academique_springboot.service;

import gestion_ecole.gestion_academique_springboot.model.DossierAdministratif;
import gestion_ecole.gestion_academique_springboot.repository.DossierAdministratifRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class DossierService {

    @Autowired
    private DossierAdministratifRepository dossierRepository;

    public List<DossierAdministratif> findAll() {
        return dossierRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<DossierAdministratif> findAllWithEleves() {
        return dossierRepository.findAllWithEleves();
    }

    @Transactional(readOnly = true)
    public DossierAdministratif findByIdWithEleve(Long id) {
        return dossierRepository.findByIdWithEleve(id).orElse(null);
    }

    public DossierAdministratif findById(Long id) {
        return dossierRepository.findById(id).orElse(null);
    }

    @Transactional
    public DossierAdministratif save(DossierAdministratif dossier) {
        // Si le dossier est nouveau (pas d'ID)
        if (dossier.getId() == null) {
            // 1. Définir la date automatiquement
            dossier.setDateCreation(LocalDate.now()); // CORRECTION ICI

            // 2. Sauvegarde initiale pour avoir ID
            dossier = dossierRepository.save(dossier);

            // 3. Génération du numéro d'inscription
            if (dossier.getEleve() != null && dossier.getEleve().getFiliere() != null) {
                String codeFiliere = dossier.getEleve().getFiliere().getCodeFiliere();
                int year = LocalDate.now().getYear();
                String numero = codeFiliere + "-" + year + "-" + dossier.getId();
                dossier.setNumeroInscription(numero);

                // 4. Update final avec le numéro
                return dossierRepository.save(dossier);
            }
        }

        // Si le dossier existe déjà (modification)
        return dossierRepository.save(dossier);
    }

    @Transactional
    public void delete(Long id) {
        dossierRepository.deleteById(id);
    }
}