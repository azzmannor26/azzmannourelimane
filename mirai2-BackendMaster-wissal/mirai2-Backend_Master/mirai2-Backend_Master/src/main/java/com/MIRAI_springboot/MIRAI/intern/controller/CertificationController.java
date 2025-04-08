package com.MIRAI_springboot.MIRAI.intern.controller;

import com.MIRAI_springboot.MIRAI.entities.Certification;
import com.MIRAI_springboot.MIRAI.entities.ENUMS.RapportStatus;
import com.MIRAI_springboot.MIRAI.entities.ENUMS.UserRole;
import com.MIRAI_springboot.MIRAI.intern.repository.CertificationRepository;
import com.MIRAI_springboot.MIRAI.intern.service.CertificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/certifications")
@RequiredArgsConstructor
public class CertificationController {

    private final CertificationService certificationService;
    @Autowired
    private CertificationRepository certificationRepository;


    @PostMapping
    public ResponseEntity<Certification> requestCertification(HttpServletRequest request) {
        Long tokenUserId = (Long) request.getAttribute("userId");
        String role = (String) request.getAttribute("role");

        // Allow only STAGIAIRE to request certifications
        if (!UserRole.STAGIAIRE.name().equals(role)) {
            return ResponseEntity.status(403).body(null);
        }

        // Use the tokenUserId directly
        Certification created = certificationService.createCertification(tokenUserId);
        return ResponseEntity.ok(created);
    }


    @PutMapping("/{certificationId}/status")
    public ResponseEntity<Certification> updateCertificationStatus(
            @PathVariable Integer certificationId,
            @RequestParam RapportStatus newStatus,
            HttpServletRequest request
    ) {
        String role = (String) request.getAttribute("role");

        // Allow only RH to update the certification status
        if (!UserRole.RH.name().equals(role)) {
            return ResponseEntity.status(403).body(null);
        }

        Certification updated = certificationService.updateCertificationStatus(certificationId, newStatus);
        return ResponseEntity.ok(updated);
    }
    //new
    // (1) Let the STAGIAIRE see their own certificate
    @GetMapping("/mine")
    public ResponseEntity<Certification> getMyCertificate(HttpServletRequest request) {
        Long tokenUserId = (Long) request.getAttribute("userId");
        String role = (String) request.getAttribute("role");

        if (!UserRole.STAGIAIRE.name().equals(role)) {
            return ResponseEntity.status(403).build();
        }

        Certification cert = certificationService.getLatestCertificationForStagiaire(tokenUserId);
        if (cert == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(cert);
    }


    // (2) Let STAGIAIRE (owner) or RH/SUPERVISEUR download the accepted PDF
    @GetMapping("/{certificationId}/download")
    public ResponseEntity<byte[]> downloadCertificate(
            @PathVariable Integer certificationId,
            HttpServletRequest request
    ) {
        Long tokenUserId = (Long) request.getAttribute("userId");
        String role = (String) request.getAttribute("role");

        // Retrieve the certificate
        Certification cert = certificationService.getCertificationById(certificationId);
        if (cert == null) {
            return ResponseEntity.notFound().build();
        }

        // If STAGIAIRE => must be the owner
        if (UserRole.STAGIAIRE.name().equals(role)) {
            if (!cert.getStagiaire().getId().equals(tokenUserId)) {
                return ResponseEntity.status(403).build();
            }
        }
        // (Optionally) if RH or SUPERVISEUR => allow automatically
        // else return ResponseEntity.status(403).build(); // if you don't want them to download

        // Must be 'accepted' => PDF is generated
        if (cert.getStatus() != RapportStatus.accepted) {
            return ResponseEntity.status(403).build();
        }

        // Get the PDF path
        String pdfPath = cert.getCertificatePath();
        if (pdfPath == null) {
            return ResponseEntity.notFound().build();
        }

        // Read file from disk
        try {
            java.nio.file.Path path = java.nio.file.Paths.get(pdfPath);
            byte[] fileData = java.nio.file.Files.readAllBytes(path);

            return ResponseEntity
                    .ok()
                    .contentType(org.springframework.http.MediaType.APPLICATION_PDF)
                    .body(fileData);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    @GetMapping
    public List<Map<String, Object>> getAllCertifications() {
        List<Object[]> results = certificationRepository.findAllWithUsernames();
        List<Map<String, Object>> formattedResults = new ArrayList<>();

        for (Object[] row : results) {
            Map<String, Object> certification = new HashMap<>();
            certification.put("id", row[0]);
            certification.put("username", row[1]);  // Nom du stagiaire
            certification.put("typedocument", row[2]); // Chemin du certificat
            certification.put("status", row[3]); // Statut du certificat
            formattedResults.add(certification);
        }
        return formattedResults;
    }

}
