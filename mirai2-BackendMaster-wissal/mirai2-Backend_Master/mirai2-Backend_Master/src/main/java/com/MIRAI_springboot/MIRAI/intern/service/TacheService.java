package com.MIRAI_springboot.MIRAI.intern.service;

import com.MIRAI_springboot.MIRAI.entities.ENUMS.Status;
import com.MIRAI_springboot.MIRAI.entities.Tache;
import com.MIRAI_springboot.MIRAI.entities.stagiaire;
import com.MIRAI_springboot.MIRAI.entities.superviseur;
import com.MIRAI_springboot.MIRAI.exception.ResourceNotFoundException;
import com.MIRAI_springboot.MIRAI.intern.repository.TacheRepository;
import com.MIRAI_springboot.MIRAI.intern.repository.StagiaireRepository;
import com.MIRAI_springboot.MIRAI.intern.repository.SuperviseurAUTRERepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TacheService {

    private final TacheRepository tacheRepository;
    private final StagiaireRepository stagiaireRepository;
    private final SuperviseurAUTRERepository superviseurRepository;

    // Directory to save uploaded task files
    private static final String TACHE_DIRECTORY = "taches/";

    /**
     * Create a new task assigned by a supervisor to a stagiaire.
     * Only supervisors assigned to the stagiaire can create tasks for them.
     */
    public Tache createTache(Long stagiaireId, Long superviseurId, String description, LocalDate dateEcheance, MultipartFile file) {
        // Retrieve the stagiaire
        stagiaire stg = stagiaireRepository.findById(stagiaireId)
                .orElseThrow(() -> new ResourceNotFoundException("Stagiaire not found with ID " + stagiaireId));

        // Check if the supervisor is assigned to the stagiaire
        if (!stg.getSuperviseur().getId().equals(superviseurId)) {
            throw new ResourceNotFoundException("Supervisor not assigned to this stagiaire.");
        }

        // Save the file and get the path
        String filePath = null;
        if (file != null && !file.isEmpty()) {
            filePath = saveFile(file);
        }

        // Create the new Tache
        Tache tache = new Tache();
        tache.setDescription(filePath == null ? description : description + " (File: " + filePath + ")");
        tache.setDateEcheance(dateEcheance);
        tache.setStatut(Status.pending); // Default status
        tache.setStagiaire(stg);
        tache.setSuperviseur(stg.getSuperviseur());

        return tacheRepository.save(tache);
    }

    /**
     * Get all tasks assigned by a specific supervisor to their stagiaires.
     */
    public List<Tache> getAllTachesForSupervisor(Long superviseurId) {
        return tacheRepository.findBySuperviseurId(superviseurId);
    }

    /**
     * Get all tasks assigned to a specific stagiaire by their supervisor.
     */
    public List<Tache> getTachesForStagiaireAndSupervisor(Long stagiaireId, Long superviseurId) {
        return tacheRepository.findByStagiaireIdAndSuperviseurId(stagiaireId, superviseurId);
    }

    /**
     * Get a single task by ID with role-based access control.
     */
    public Tache getTacheById(Long tacheId, Long superviseurId, Long stagiaireId) {
        Tache tache = tacheRepository.findById(tacheId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with ID " + tacheId));

        if (superviseurId != null && !tache.getSuperviseur().getId().equals(superviseurId)) {
            throw new ResourceNotFoundException("Task not created by this supervisor.");
        }

        if (stagiaireId != null && !tache.getStagiaire().getId().equals(stagiaireId)) {
            throw new ResourceNotFoundException("Task not assigned to this stagiaire.");
        }

        return tache;
    }

    /**
     * Update the status of a task (by stagiaire only).
     */
    public Tache updateTacheStatus(Long tacheId, Long stagiaireId, Status newStatus) {
        Tache tache = tacheRepository.findById(tacheId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with ID " + tacheId));

        if (!tache.getStagiaire().getId().equals(stagiaireId)) {
            throw new ResourceNotFoundException("Task not assigned to this stagiaire.");
        }

        tache.setStatut(newStatus);
        return tacheRepository.save(tache);
    }

    /**
     * Save the uploaded file to the project's directory.
     */
    private String saveFile(MultipartFile file) {
        try {
            Path directoryPath = Paths.get(TACHE_DIRECTORY);
            if (!Files.exists(directoryPath)) {
                Files.createDirectories(directoryPath);
            }

            String uniqueFileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path filePath = directoryPath.resolve(uniqueFileName);
            Files.copy(file.getInputStream(), filePath);

            return filePath.toString();
        } catch (IOException e) {
            throw new RuntimeException("Failed to save file.", e);
        }
    }
    //new
    public List<Tache> getTachesForStagiaire(Long stagiaireId) {
        return tacheRepository.findByStagiaireId(stagiaireId);
    }

}
