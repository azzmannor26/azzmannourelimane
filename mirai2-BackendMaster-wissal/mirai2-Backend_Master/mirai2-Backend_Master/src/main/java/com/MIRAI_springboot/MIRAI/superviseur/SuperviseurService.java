package com.MIRAI_springboot.MIRAI.superviseur;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import com.MIRAI_springboot.MIRAI.entities.*;
import com.MIRAI_springboot.MIRAI.entities.ENUMS.RapportStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.Serializable;
import java.nio.file.AccessDeniedException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SuperviseurService {

    private final SupervisorRepository superviseurRepository;
    private final TacheAssignRepository tacheRepository;
    private final AvailabilityRepository availabilityRepository;
    private final RapportSupervRepository rapportRepository;
    private final StagiaireSupervRepository stagiaireRepository;

    @Transactional
    public Availability createAvailability(Long superviseurId, Availability availability) {
        superviseur superviseur = superviseurRepository.findById(superviseurId)
                .orElseThrow(() -> new EntityNotFoundException("Superviseur not found with ID: " + superviseurId));

        availability.setSuperviseur(superviseur);

        return availabilityRepository.save(availability);
    }


    @Transactional(readOnly = true)
    public List<Availability> getAvailabilities(Long superviseurId) {
        return availabilityRepository.findBySuperviseurId(superviseurId);
    }

    @Transactional
    public Tache createTache(Long superviseurId, Long stagiaireId, Tache tache) {
        // Find the superviseur
        superviseur superviseur = superviseurRepository.findById(superviseurId)
                .orElseThrow(() -> new EntityNotFoundException("Superviseur not found with ID: " + superviseurId));

        // Find the stagiaire
        stagiaire stagiaire = stagiaireRepository.findById(stagiaireId)
                .orElseThrow(() -> new EntityNotFoundException("Stagiaire not found with ID: " + stagiaireId));

        // Set relationships
        tache.setSuperviseur(superviseur);
        tache.setStagiaire(stagiaire);

        // Save the task
        return tacheRepository.save(tache);
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getTachesBySuperviseurAndStagiaire(Long superviseurId, Long stagiaireId) {
        List<Tache> taches = tacheRepository.findTasksBySuperviseurAndStagiaire(superviseurId, stagiaireId);

        // Convert Tache objects to Maps with stagiaire name (username instead of ID)
        return taches.stream().map(tache -> {
            Map<String, Object> taskMap = new HashMap<>();
            taskMap.put("description", tache.getDescription());
            taskMap.put("dateEcheance", tache.getDateEcheance().toString()); // ✅ Ensure date serialization
            taskMap.put("statut", tache.getStatut().name());
            taskMap.put("stagiaireName", tache.getStagiaire().getUsername());

            return taskMap;
        }).collect(Collectors.toList());
    }


    @Transactional
    public Rapport evaluateRapport(Long superviseurId, Long rapportId, RapportStatus status) throws AccessDeniedException {
        Rapport rapport = rapportRepository.findById(rapportId)
                .orElseThrow(() -> new EntityNotFoundException("Rapport not found"));

        // Ensure the superviseur matches (optional)
        if (!rapport.getSuperviseur().getId().equals(superviseurId)) {
            throw new AccessDeniedException("Superviseur does not have permission to evaluate this rapport.");
        }

        rapport.setType(status); // Assign the enum directly
        return rapportRepository.save(rapport);
    }




    @Transactional(readOnly = true)
    public List<Rapport> getAllRapportsForSuperviseur(Long superviseurId) {
        // Fetch all rapports for all stagiaires assigned to the superviseur
        return rapportRepository.findAllBySuperviseurId(superviseurId);
    }

    @Transactional(readOnly = true)
    public List<stagiaire> getAssignedStagiaires(Long superviseurId) {
        return stagiaireRepository.findBySuperviseurId(superviseurId);
    }


    @Transactional(readOnly = true)
    // ✅ Fetch Supervisor assigned to a Stagiaire
    public Optional<superviseur> getSupervisorByStagiaireId(Long stagiaireId) {
        return superviseurRepository.findByStagiaireId(stagiaireId);
    }
    public List<stagiaire> getInternsBySupervisorId(Long supervisorId) {
        return superviseurRepository.findInternsBySupervisorId(supervisorId);
    }

}

