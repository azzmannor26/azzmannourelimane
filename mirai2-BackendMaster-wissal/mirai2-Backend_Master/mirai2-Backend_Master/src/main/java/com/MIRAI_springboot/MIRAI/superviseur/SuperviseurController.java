package com.MIRAI_springboot.MIRAI.superviseur;

import com.MIRAI_springboot.MIRAI.entities.ENUMS.Status;
import com.MIRAI_springboot.MIRAI.entities.stagiaire;
import com.MIRAI_springboot.MIRAI.entities.Availability;
import com.MIRAI_springboot.MIRAI.entities.ENUMS.RapportStatus;
import com.MIRAI_springboot.MIRAI.entities.Rapport;
import com.MIRAI_springboot.MIRAI.entities.Tache;
import com.MIRAI_springboot.MIRAI.entities.ENUMS.UserRole;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.nio.file.AccessDeniedException;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/superviseur")
@RequiredArgsConstructor
public class SuperviseurController {

    private final SuperviseurService superviseurService;

    @PostMapping("/{superviseurId}/availability")
    public ResponseEntity<Availability> createAvailability(
            @PathVariable Long superviseurId,
            @RequestBody Availability availability,
            HttpServletRequest request
    ) {
        String role = (String) request.getAttribute("role");
        Long tokenUserId = (Long) request.getAttribute("userId");

        if (!UserRole.SUPERVISEUR.name().equals(role) || !tokenUserId.equals(superviseurId)) {
            return ResponseEntity.status(403).body(null);
        }

        return ResponseEntity.ok(superviseurService.createAvailability(superviseurId, availability));
    }

    @GetMapping("/{superviseurId}/availabilities")
    public ResponseEntity<List<Availability>> getAvailabilities(
            @PathVariable Long superviseurId,
            HttpServletRequest request
    ) {
        String role = (String) request.getAttribute("role");
        Long tokenUserId = (Long) request.getAttribute("userId");

        if (!UserRole.SUPERVISEUR.name().equals(role) || !tokenUserId.equals(superviseurId)) {
            return ResponseEntity.status(403).body(null);
        }

        return ResponseEntity.ok(superviseurService.getAvailabilities(superviseurId));
    }

    @PostMapping("/{superviseurId}/tache")
    public ResponseEntity<?> createTache(
            @PathVariable Long superviseurId,
            @RequestParam(required = false) Long stagiaireId,
            @RequestBody Map<String, Object> payload,
            HttpServletRequest request
    ) {
        if (stagiaireId == null) {
            return ResponseEntity.badRequest().body("Error: Stagiaire ID is required.");
        }

        String description = (String) payload.get("description");
        String statutString = (String) payload.get("statut");
        String deadlineString = (String) payload.get("startDate");

        if (description == null || statutString == null || deadlineString == null) {
            return ResponseEntity.badRequest().body("Error: Missing required fields.");
        }

        // ✅ Convert `statutString` to lowercase to match enum
        Status statut;
        try {
            statut = Status.valueOf(statutString.toLowerCase()); // ✅ Now accepts mixed case
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Error: Invalid task status. Allowed values: pending, inprogress, completed, failed.");
        }

        LocalDate deadline = LocalDate.parse(deadlineString);

        Tache tache = new Tache();
        tache.setDescription(description);
        tache.setDateEcheance(deadline);
        tache.setStatut(statut);

        Tache createdTache = superviseurService.createTache(superviseurId, stagiaireId, tache);
        return ResponseEntity.ok(createdTache);
    }




    @GetMapping("/{superviseurId}/stagiaire/{stagiaireId}/taches")
    public ResponseEntity<List<Map<String, Object>>> getTachesBySuperviseurAndStagiaire(
            @PathVariable Long superviseurId,
            @PathVariable Long stagiaireId,
            HttpServletRequest request
    ) {
        // ✅ Validate that the requester is the correct supervisor
        String role = (String) request.getAttribute("role");
        Long tokenUserId = (Long) request.getAttribute("userId");

        if (!UserRole.SUPERVISEUR.name().equals(role) || !tokenUserId.equals(superviseurId)) {
            return ResponseEntity.status(403).body(null);
        }

        // ✅ Fetch the tasks and return them with the intern's name
        return ResponseEntity.ok(superviseurService.getTachesBySuperviseurAndStagiaire(superviseurId, stagiaireId));
    }


    @PutMapping("/{superviseurId}/rapports/{rapportId}/evaluate")
    public ResponseEntity<Rapport> evaluateRapport(
            @PathVariable Long superviseurId,
            @PathVariable Long rapportId,
            @RequestParam String type,
            HttpServletRequest request
    ) throws AccessDeniedException {
        String role = (String) request.getAttribute("role");
        Long tokenUserId = (Long) request.getAttribute("userId");

        if (!UserRole.SUPERVISEUR.name().equals(role) || !tokenUserId.equals(superviseurId)) {
            return ResponseEntity.status(403).body(null);
        }

        RapportStatus status = Arrays.stream(RapportStatus.values())
                .filter(enumValue -> enumValue.name().equalsIgnoreCase(type))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Invalid RapportStatus: " + type));

        Rapport updatedRapport = superviseurService.evaluateRapport(superviseurId, rapportId, status);
        return ResponseEntity.ok(updatedRapport);
    }

    @GetMapping("/{superviseurId}/rapports")
    public ResponseEntity<List<Rapport>> getRapports(
            @PathVariable Long superviseurId,
            HttpServletRequest request
    ) {
        String role = (String) request.getAttribute("role");
        Long tokenUserId = (Long) request.getAttribute("userId");

        if (!UserRole.SUPERVISEUR.name().equals(role) || !tokenUserId.equals(superviseurId)) {
            return ResponseEntity.status(403).body(null);
        }

        return ResponseEntity.ok(superviseurService.getAllRapportsForSuperviseur(superviseurId));
    }

    @GetMapping("/{superviseurId}/stagiaires")
    public ResponseEntity<List<stagiaire>> getStagiaires(
            @PathVariable Long superviseurId,
            HttpServletRequest request
    ) {
        String role = (String) request.getAttribute("role");
        Long tokenUserId = (Long) request.getAttribute("userId");

        if (!UserRole.SUPERVISEUR.name().equals(role) || !tokenUserId.equals(superviseurId)) {
            return ResponseEntity.status(403).body(null);
        }

        return ResponseEntity.ok(superviseurService.getAssignedStagiaires(superviseurId));
    }
}
