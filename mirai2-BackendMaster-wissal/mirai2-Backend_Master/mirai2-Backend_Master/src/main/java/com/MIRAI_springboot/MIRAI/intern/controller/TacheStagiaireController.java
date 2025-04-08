package com.MIRAI_springboot.MIRAI.intern.controller;

import com.MIRAI_springboot.MIRAI.entities.ENUMS.Status;
import com.MIRAI_springboot.MIRAI.entities.Tache;
import com.MIRAI_springboot.MIRAI.entities.ENUMS.UserRole;
import com.MIRAI_springboot.MIRAI.intern.service.TacheService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/taches")
@RequiredArgsConstructor
public class TacheStagiaireController {

    private final TacheService tacheService;

    /**
     * Create a new task for a stagiaire.
     * Only supervisors assigned to the stagiaire can create tasks for them.
     *
     * API Endpoint: POST /taches
     *
     * Example Postman Request:
     * - URL: http://localhost:8080/taches
     * - Method: POST
     * - Headers:
     *     Authorization: Bearer <TOKEN>
     * - Body (form-data):
     *     - stagiaireId: 1
     *     - description: Task description
     *     - dateEcheance: 2025-01-20 (optional)
     *     - file: [Attach file] (optional)
     */
    @PostMapping
    public ResponseEntity<Tache> createTache(
            @RequestParam Long stagiaireId,
            @RequestParam String description,
            @RequestParam(required = false) LocalDate dateEcheance,
            @RequestParam(required = false) MultipartFile file,
            HttpServletRequest request
    ) {
        Long superviseurId = (Long) request.getAttribute("userId");
        String role = (String) request.getAttribute("role");

        // Check if the user has the SUPERVISEUR role
        if (!UserRole.SUPERVISEUR.name().equals(role)) {
            return ResponseEntity.status(403).body(null);
        }

        // Create the task
        Tache createdTache = tacheService.createTache(stagiaireId, superviseurId, description, dateEcheance, file);
        return ResponseEntity.ok(createdTache);
    }

    /**
     * Update the status of a task.
     * Only stagiaires can update the status of tasks assigned to them.
     *
     * API Endpoint: PUT /taches/{tacheId}/status
     *
     * Example Postman Request:
     * - URL: http://localhost:8080/taches/1/status
     * - Method: PUT
     * - Headers:
     *     Authorization: Bearer <TOKEN>
     * - Body (x-www-form-urlencoded):
     *     - newStatus: completed
     */
    @PutMapping("/{tacheId}/status")
    public ResponseEntity<?> updateTacheStatus(
            @PathVariable Long tacheId,
            @RequestParam String newStatus, // ✅ Ensure correct field name
            HttpServletRequest request
    ) {
        Long stagiaireId = (Long) request.getAttribute("userId");
        String role = (String) request.getAttribute("role");

        if (!UserRole.STAGIAIRE.name().equals(role)) {
            return ResponseEntity.status(403).body("Access denied: Only stagiaires can update task status.");
        }

        try {
            // ✅ Convert to lowercase to match ENUM values in backend
            Status enumStatus = Status.valueOf(newStatus.toLowerCase());
            Tache updatedTache = tacheService.updateTacheStatus(tacheId, stagiaireId, enumStatus);
            return ResponseEntity.ok(updatedTache);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid status: " + newStatus);
        }
    }

    /**
     * Get all tasks assigned by the logged-in supervisor to their stagiaires.
     *
     * API Endpoint: GET /taches
     *
     * Example Postman Request:
     * - URL: http://localhost:8080/taches
     * - Method: GET
     * - Headers:
     *     Authorization: Bearer <TOKEN>
     */
    @GetMapping
    public ResponseEntity<List<Tache>> getAllTaches(HttpServletRequest request) {
        String role = (String) request.getAttribute("role");
        Long superviseurId = (Long) request.getAttribute("userId");

        // Check if the user has the SUPERVISEUR role
        if (!UserRole.SUPERVISEUR.name().equals(role)) {
            return ResponseEntity.status(403).body(null);
        }

        // Retrieve all tasks for the supervisor
        List<Tache> taches = tacheService.getAllTachesForSupervisor(superviseurId);
        return ResponseEntity.ok(taches);
    }

    /**
     * Get a task by ID.
     * Supervisors can access tasks they assigned to their stagiaires.
     * Stagiaires can access tasks assigned to them by their supervisor.
     *
     * API Endpoint: GET /taches/{tacheId}
     *
     * Example Postman Request:
     * - URL: http://localhost:8080/taches/1
     * - Method: GET
     * - Headers:
     *     Authorization: Bearer <TOKEN>
     */
    @GetMapping("/{tacheId}")
    public ResponseEntity<Tache> getTacheById(
            @PathVariable Long tacheId,
            HttpServletRequest request
    ) {
        String role = (String) request.getAttribute("role");
        Long tokenUserId = (Long) request.getAttribute("userId");

        if (UserRole.SUPERVISEUR.name().equals(role)) {
            Tache tache = tacheService.getTacheById(tacheId, tokenUserId, null);
            return ResponseEntity.ok(tache);
        } else if (UserRole.STAGIAIRE.name().equals(role)) {
            Tache tache = tacheService.getTacheById(tacheId, null, tokenUserId);
            return ResponseEntity.ok(tache);
        } else {
            return ResponseEntity.status(403).body(null);
        }
    }

    /**
     * Get all tasks assigned to a specific stagiaire by their supervisor.
     *
     * API Endpoint: GET /taches/stagiaire/{stagiaireId}
     *
     * Example Postman Request:
     * - URL: http://localhost:8080/taches/stagiaire/1
     * - Method: GET
     * - Headers:
     *     Authorization: Bearer <TOKEN>
     */
   //new
    @GetMapping("/stagiaire/{stagiaireId}")
    public ResponseEntity<List<Tache>> getTachesForStagiaire(
            @PathVariable Long stagiaireId,
            HttpServletRequest request
    ) {
        String role = (String) request.getAttribute("role");
        Long tokenUserId = (Long) request.getAttribute("userId");

        if (UserRole.SUPERVISEUR.name().equals(role)) {
            // Supervisor can get tasks assigned to a specific stagiaire
            List<Tache> taches = tacheService.getTachesForStagiaireAndSupervisor(stagiaireId, tokenUserId);
            return ResponseEntity.ok(taches);
        } else if (UserRole.STAGIAIRE.name().equals(role)) {
            // Stagiaire should get all tasks assigned to them
            List<Tache> taches = tacheService.getTachesForStagiaire(tokenUserId);
            return ResponseEntity.ok(taches);
        } else {
            return ResponseEntity.status(403).body(null);
        }
    }
}
