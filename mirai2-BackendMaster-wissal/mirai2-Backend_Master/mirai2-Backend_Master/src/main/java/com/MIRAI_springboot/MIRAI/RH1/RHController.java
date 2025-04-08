package com.MIRAI_springboot.MIRAI.RH1;

import com.MIRAI_springboot.MIRAI.DTO.StagiaireDTO;
import com.MIRAI_springboot.MIRAI.entities.RH;
import com.MIRAI_springboot.MIRAI.entities.Stage;
import com.MIRAI_springboot.MIRAI.entities.stagiaire;
import com.MIRAI_springboot.MIRAI.entities.ENUMS.UserRole;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

import com.MIRAI_springboot.MIRAI.Candidature.CandidatureService3;

@RestController
@RequestMapping("/rh")
public class RHController {

    @Autowired
    private RHService rhService;
    @Autowired
    private CandidatureService3 candidatureService;

    @Autowired
    private CandidatureRepository candidatureRepository;
    // Endpoint to view all supervisors' availabilities
    @GetMapping("/supervisors/availabilities")
    public ResponseEntity<List<Object[]>> getAllSupervisorsAvailabilities() {
        List<Object[]> availabilities = rhService.getAllSupervisorsAvailabilities();
        return ResponseEntity.ok(availabilities);
    }

    // 1. Candidature Management
    @PutMapping("/candidatures/valider/{id}")
    public ResponseEntity<String> validerCandidature(@PathVariable Long id, HttpServletRequest request) {
        String role = (String) request.getAttribute("role");
        Long tokenUserId = (Long) request.getAttribute("userId");

        // 🔍 Log des informations de la requête
        System.out.println("🔍 Tentative de validation de la candidature ID : " + id);
        System.out.println("👤 Rôle utilisateur : " + role + " | ID utilisateur : " + tokenUserId);

        if (!UserRole.RH.name().equals(role)) {
            System.out.println("❌ Accès refusé : rôle non autorisé.");
            return ResponseEntity.status(403).body("Vous n'avez pas les permissions nécessaires pour cette action.");
        }

        try {
            System.out.println("✅ Permissions vérifiées. Appel du service de validation...");
            rhService.validerCandidature(id);
            System.out.println("✅ Candidature ID " + id + " validée avec succès.");
            return ResponseEntity.ok("Candidature validée et email envoyé au candidat.");
        } catch (EntityNotFoundException e) {
            System.err.println("❌ Erreur : Candidature ou utilisateur introuvable pour l'ID : " + id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Utilisateur ou candidature introuvable.");
        } catch (Exception e) {
            System.err.println("❌ Erreur interne lors de la validation de la candidature ID : " + id);
            e.printStackTrace(); // Affiche la stack trace complète pour le debug
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Une erreur est survenue.");
        }
    }


    // 2. RH Management
    @PutMapping("/{id}/update-profile")
    public ResponseEntity<RH> updateProfile(
            @PathVariable Long id,
            @RequestBody RH updatedRH,
            HttpServletRequest request
    ) {
        String role = (String) request.getAttribute("role");
        Long tokenUserId = (Long) request.getAttribute("userId");

        if (!UserRole.RH.name().equals(role) || !tokenUserId.equals(id)) {
            return ResponseEntity.status(403).body(null);
        }

        RH rh = rhService.updateProfile(id, updatedRH);
        return ResponseEntity.ok(rh);
    }

    @GetMapping
    public ResponseEntity<Iterable<RH>> getAllRH(HttpServletRequest request) {
        String role = (String) request.getAttribute("role");

        if (!UserRole.RH.name().equals(role)) {
            return ResponseEntity.status(403).body(null);
        }

        Iterable<RH> allRH = rhService.getAllRH();
        return ResponseEntity.ok(allRH);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RH> getRHById(
            @PathVariable Long id,
            HttpServletRequest request
    ) {
        String role = (String) request.getAttribute("role");
        Long tokenUserId = (Long) request.getAttribute("userId");

        if (!UserRole.RH.name().equals(role) || !tokenUserId.equals(id)) {
            return ResponseEntity.status(403).body(null);
        }

        RH rh = rhService.getRHById(id);
        return ResponseEntity.ok(rh);
    }

    // 3. Stagiaire Management
    @GetMapping("/stagiaires/getAll")
    public List<stagiaire> getAllStagiaires(HttpServletRequest request) {
        String role = (String) request.getAttribute("role");

        if (!UserRole.RH.name().equals(role)) {
            return List.of();
        }

        return rhService.getAllStagiaires();
    }

    @GetMapping("/stagiaires/getById/{id}")
    public ResponseEntity<?> getStagiaireById(
            @PathVariable Long id,
            HttpServletRequest request
    ) {
        String role = (String) request.getAttribute("role");
        Long tokenUserId = (Long) request.getAttribute("userId");

        if (!UserRole.RH.name().equals(role) || !tokenUserId.equals(id)) {
            return ResponseEntity.status(403).body(null);
        }

        try {
            StagiaireDTO stagiaireDTO = rhService.getStagiaireById(id);
            return ResponseEntity.ok(stagiaireDTO);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    Map.of("message", "Stagiaire introuvable", "id", id)
            );
        }
    }

    // 4. Assignment Management
    @PutMapping("/assign/stagiaire/{stagiaireId}/superviseur/{superviseurId}")
    public ResponseEntity<String> assignStagiaireToSuperviseur(
            @PathVariable Long stagiaireId,
            @PathVariable Long superviseurId,
            HttpServletRequest request
    ) {
        String role = (String) request.getAttribute("role");
        Long tokenUserId = (Long) request.getAttribute("userId");

        // 🔍 Debugging logs pour vérifier les valeurs
        System.out.println("🔍 Vérification des permissions :");
        System.out.println("Role dans le token : " + role);
        System.out.println("ID utilisateur du token : " + tokenUserId);
        System.out.println("Superviseur ID reçu : " + superviseurId);

        // ✅ Correction : Vérifie seulement que l'utilisateur a le rôle RH
        if (!UserRole.RH.name().equals(role)) {
            return ResponseEntity.status(403).body("Accès refusé : Vous devez être RH.");
        }

        try {
            rhService.assignStagiaireToSuperviseur(stagiaireId, superviseurId);
            return ResponseEntity.ok("✅ Stagiaire attribué au superviseur avec succès !");
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("❌ Erreur : " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("❌ Erreur interne du serveur.");
        }
    }

    @GetMapping("/superviseurs/all")
    public ResponseEntity<List<Map<String, Object>>> getAllSupervisors() {
        List<Map<String, Object>> supervisors = rhService.getAllSupervisors();
        return ResponseEntity.ok(supervisors);
    }

    @GetMapping("/superviseurs/ids")
    public ResponseEntity<List<Map<String, Object>>> getSupervisorsid() {
        List<Map<String, Object>> supervisors = rhService.getSupervisorsid();
        return ResponseEntity.ok(supervisors);
    }


    @PutMapping("/assign/intern/{stagiaireId}/supervisor/{superviseurId}")
    public ResponseEntity<?> assignInternToSupervisor(
            @PathVariable Long stagiaireId,
            @PathVariable Long superviseurId,
            @RequestBody Stage stageDetails,
            HttpServletRequest request
    ) {
        String role = (String) request.getAttribute("role");

        // ✅ Only RH can assign supervisors
        if (!UserRole.RH.name().equals(role)) {
            return ResponseEntity.status(403).body("❌ Access denied: Only RH can assign supervisors.");
        }

        try {
            // ✅ Call service to handle assignment
            Stage createdStage = rhService.assignInternToSupervisor(stagiaireId, superviseurId, stageDetails);
            return ResponseEntity.ok(createdStage);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("❌ Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("❌ Internal server error.");
        }
    }

    @GetMapping("/internships")
    public ResponseEntity<List<Map<String, Object>>> getAllInternships() {
        List<Map<String, Object>> internships = rhService.getAllInternships();
        return ResponseEntity.ok(internships);
    }

}