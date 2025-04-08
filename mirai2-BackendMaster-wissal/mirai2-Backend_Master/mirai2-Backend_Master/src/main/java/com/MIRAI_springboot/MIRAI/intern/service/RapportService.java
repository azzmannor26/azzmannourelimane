package com.MIRAI_springboot.MIRAI.intern.service;

import com.MIRAI_springboot.MIRAI.entities.ENUMS.RapportStatus;
import com.MIRAI_springboot.MIRAI.entities.ENUMS.UserRole;
import com.MIRAI_springboot.MIRAI.entities.Rapport;
import com.MIRAI_springboot.MIRAI.entities.stagiaire;
import com.MIRAI_springboot.MIRAI.entities.superviseur;
import com.MIRAI_springboot.MIRAI.exception.ResourceNotFoundException;
import com.MIRAI_springboot.MIRAI.intern.repository.RapportRepository;
import com.MIRAI_springboot.MIRAI.intern.repository.StagiaireRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class RapportService {

    private final RapportRepository rapportRepository;
    private final StagiaireRepository stagiaireRepository;

    // Directory to save uploaded rapport files
    private static final String RAPPORTS_DIRECTORY = "rapports/";

    /**
     * Create a new rapport for a stagiaire and automatically assign it to the correct supervisor.
     *
     * @param tokenUserId the ID of the logged-in stagiaire
     * @param file        the rapport file
     * @param rapportName the name of the rapport
     * @return the created Rapport
     */
    public Rapport createRapport(Long tokenUserId, MultipartFile file, String rapportName) {
        // Retrieve the stagiaire
        stagiaire stg = stagiaireRepository.findById(tokenUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Stagiaire not found with ID " + tokenUserId));

        // Retrieve the assigned supervisor
        superviseur sup = stg.getSuperviseur();
        if (sup == null) {
            throw new ResourceNotFoundException("No supervisor assigned to Stagiaire with ID " + tokenUserId);
        }

        // Save the file to the project folder
        String filePath = saveFile(file);

        // Create and save the rapport
        Rapport rapport = new Rapport();
        rapport.setNom(rapportName != null ? rapportName : file.getOriginalFilename());
        rapport.setContenu(filePath);
        rapport.setType(RapportStatus.under_review);
        rapport.setStagiaire(stg);
        rapport.setSuperviseur(sup);

        return rapportRepository.save(rapport);
    }

    /**
     * Get all rapports for a specific supervisor.
     *
     * @param supervisorId the ID of the logged-in supervisor
     * @return a list of rapports assigned to the supervisor
     */
    public List<Rapport> getAllRapportsForSupervisor(Long supervisorId) {
        return rapportRepository.findBySupervisorId(supervisorId);
    }

    /**
     * Get a specific rapport by ID, ensuring it belongs to the supervisor.
     *
     * @param rapportId    the ID of the rapport
     * @param supervisorId the ID of the logged-in supervisor
     * @return the requested rapport if it exists and belongs to the supervisor
     */
    public Rapport getRapportByIdForSupervisor(Integer rapportId, Long supervisorId) {
        return rapportRepository.findByIdAndSupervisorId(rapportId, supervisorId)
                .orElseThrow(() -> new ResourceNotFoundException("Rapport not found with ID " + rapportId + " for this supervisor."));
    }

    /**
     * Update the status of a rapport.
     *
     * @param rapportId    the ID of the rapport
     * @param supervisorId the ID of the logged-in supervisor
     * @param newStatus    the new status for the rapport
     * @return the updated rapport
     */
    public Rapport updateRapportStatus(Integer rapportId, Long supervisorId, RapportStatus newStatus) {
        Rapport rapport = getRapportByIdForSupervisor(rapportId, supervisorId);
        rapport.setType(newStatus);
        return rapportRepository.save(rapport);
    }

    /**
     * Save the uploaded file to the project's directory.
     *
     * @param file the uploaded file
     * @return the relative path where the file is stored
     */
    private String saveFile(MultipartFile file) {
        try {
            // Create the directory if it doesn't exist
            Path directoryPath = Paths.get(RAPPORTS_DIRECTORY);
            if (!Files.exists(directoryPath)) {
                Files.createDirectories(directoryPath);
            }

            // Create a unique file name and save the file
            String uniqueFileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path filePath = directoryPath.resolve(uniqueFileName);
            Files.copy(file.getInputStream(), filePath);

            // Return the relative path of the saved file
            return filePath.toString();
        } catch (IOException e) {
            log.error("Error saving file: {}", e.getMessage());
            throw new RuntimeException("Failed to save file.", e);
        }
    }
    public byte[] getRapportFile(Long requestingUserId, Integer rapportId, String role) {
        // 1) Retrieve the Rapport from DB
        Rapport rapport = rapportRepository.findById(rapportId).orElse(null);
        if (rapport == null) {
            return null; // or throw new ResourceNotFoundException(...)
        }

        // 2) Check if the user can access it:
        if (UserRole.STAGIAIRE.name().equals(role)) {
            // Make sure the currently logged-in stagiaire is the owner
            if (!rapport.getStagiaire().getId().equals(requestingUserId)) {
                return null; // not authorized
            }
        }
        // If role = SUPERVISEUR, you may allow it automatically or add your own logic

        // 3) Read the file bytes from disk using the path in rapport.getContenu()
        // Example:
        try {
            Path path = Paths.get(rapport.getContenu());
            // `rapport.getContenu()` is where you stored the file path in createRapport()
            return Files.readAllBytes(path);
        } catch (IOException e) {
            // handle error
            return null;
        }
    }
    public List<Rapport> getRapportsByStagiaireId(Long stagiaireId) {
        // You need a custom repository method, e.g.
        // List<Rapport> findByStagiaireId(Long stagiaireId);

        return rapportRepository.findByStagiaireId(stagiaireId);
    }


}
