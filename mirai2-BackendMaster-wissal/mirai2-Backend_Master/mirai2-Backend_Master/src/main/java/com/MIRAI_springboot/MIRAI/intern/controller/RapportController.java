package com.MIRAI_springboot.MIRAI.intern.controller;

import com.MIRAI_springboot.MIRAI.entities.ENUMS.RapportStatus;
import com.MIRAI_springboot.MIRAI.entities.Rapport;
import com.MIRAI_springboot.MIRAI.entities.ENUMS.UserRole;
import com.MIRAI_springboot.MIRAI.intern.service.RapportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@RequestMapping("/rapports")
@RequiredArgsConstructor
public class RapportController {

    private final RapportService rapportService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Rapport> uploadRapport(
            @RequestParam("file") MultipartFile file,
            @RequestParam(required = false) String rapportName,
            HttpServletRequest request
    ) {
        Long tokenUserId = (Long) request.getAttribute("userId");
        String role = (String) request.getAttribute("role");

        // Allow only STAGIAIRE role
        if (!UserRole.STAGIAIRE.name().equals(role)) {
            return ResponseEntity.status(403).body(null);
        }

        Rapport created = rapportService.createRapport(tokenUserId, file, rapportName);
        return ResponseEntity.ok(created);
    }

    @GetMapping
    public ResponseEntity<List<Rapport>> getAllRapports(HttpServletRequest request) {
        String role = (String) request.getAttribute("role");
        Long tokenUserId = (Long) request.getAttribute("userId");

        // Allow only SUPERVISEUR role
        if (!UserRole.SUPERVISEUR.name().equals(role)) {
            return ResponseEntity.status(403).body(null);
        }

        List<Rapport> rapports = rapportService.getAllRapportsForSupervisor(tokenUserId);
        return ResponseEntity.ok(rapports);
    }

    @GetMapping("/{rapportId}")
    public ResponseEntity<Rapport> getRapportById(
            @PathVariable Integer rapportId,
            HttpServletRequest request
    ) {
        String role = (String) request.getAttribute("role");
        Long tokenUserId = (Long) request.getAttribute("userId");

        // Allow only SUPERVISEUR role
        if (!UserRole.SUPERVISEUR.name().equals(role)) {
            return ResponseEntity.status(403).body(null);
        }

        Rapport rapport = rapportService.getRapportByIdForSupervisor(rapportId, tokenUserId);
        return ResponseEntity.ok(rapport);
    }

    @PutMapping("/{rapportId}/status")
    public ResponseEntity<Rapport> updateRapportStatus(
            @PathVariable Integer rapportId,
            @RequestParam RapportStatus newStatus,
            HttpServletRequest request
    ) {
        String role = (String) request.getAttribute("role");
        Long tokenUserId = (Long) request.getAttribute("userId");

        // Allow only SUPERVISEUR role
        if (!UserRole.SUPERVISEUR.name().equals(role)) {
            return ResponseEntity.status(403).body(null);
        }

        Rapport updated = rapportService.updateRapportStatus(rapportId, tokenUserId, newStatus);
        return ResponseEntity.ok(updated);
    }
    // 1) ALLOW A STAGIAIRE TO SEE ALL THEIR OWN RAPPORTS
    @GetMapping("/mine")
    public ResponseEntity<List<Rapport>> getMyRapports(HttpServletRequest request) {
        Long tokenUserId = (Long) request.getAttribute("userId");
        String role = (String) request.getAttribute("role");

        // Only STAGIAIRE can see their own reports
        if (!UserRole.STAGIAIRE.name().equals(role)) {
            return ResponseEntity.status(403).build();
        }

        // Implement a new service method: getRapportsByStagiaireId(tokenUserId)
        // (or however you named it). It should return all Rapport records
        // where 'stagiaire.id' = tokenUserId.
        List<Rapport> myRapports = rapportService.getRapportsByStagiaireId(tokenUserId);
        return ResponseEntity.ok(myRapports);
    }

    // 2) ALLOW STAGIAIRE (OWNER) OR SUPERVISEUR TO DOWNLOAD A PDF
    @GetMapping("/{rapportId}/download")
    public ResponseEntity<byte[]> downloadRapportFile(
            @PathVariable Integer rapportId,
            HttpServletRequest request
    ) {
        Long tokenUserId = (Long) request.getAttribute("userId");
        String role = (String) request.getAttribute("role");

        // If the user is a STAGIAIRE, they must own the report.
        // If SUPERVISEUR, we can allow it automatically (or you could add more logic).
        // We'll rely on the service to return null if unauthorized.
        byte[] fileData = rapportService.getRapportFile(tokenUserId, rapportId, role);

        if (fileData == null) {
            // Could mean not found or not authorized
            return ResponseEntity.notFound().build();
        }

        // Return the PDF as a byte array
        return ResponseEntity
                .ok()
                .contentType(MediaType.APPLICATION_PDF)
                .body(fileData);
    }

}
