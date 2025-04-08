package com.MIRAI_springboot.MIRAI.intern.controller;

import com.MIRAI_springboot.MIRAI.entities.ENUMS.UserRole;
import com.MIRAI_springboot.MIRAI.intern.dto.StagiaireProfileDTO;
import com.MIRAI_springboot.MIRAI.intern.service.StagiaireProfileService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;

@RestController
@RequestMapping("/stagiaire-profile")
public class StagiaireProfileController {

    private final StagiaireProfileService stagiaireProfileService;
    private final ObjectMapper objectMapper;

    public StagiaireProfileController(StagiaireProfileService stagiaireProfileService, ObjectMapper objectMapper) {
        this.stagiaireProfileService = stagiaireProfileService;
        this.objectMapper = objectMapper;
    }

    @PutMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> updateStagiaireProfile(
            @RequestPart("profile") String profileJson,
            @RequestPart(value = "profileImage", required = false) MultipartFile profileImage,
            HttpServletRequest request) {

        Long tokenUserId = (Long) request.getAttribute("userId");
        String role = (String) request.getAttribute("role");

        if (!UserRole.STAGIAIRE.name().equals(role)) {
            return ResponseEntity.status(403).body("Access denied. Only stagiaires can update their profile.");
        }

        StagiaireProfileDTO profileDTO;
        try {
            profileDTO = objectMapper.readValue(profileJson, StagiaireProfileDTO.class);
        } catch (IOException e) {
            return ResponseEntity.badRequest().body("Invalid profile data: " + e.getMessage());
        }

        if (profileImage != null && !profileImage.isEmpty()) {
            try {
                String originalFilename = profileImage.getOriginalFilename();
                String sanitizedFilename = originalFilename.replaceAll("[^a-zA-Z0-9\\.\\-]", "_");
                String newFilename = tokenUserId + "_" + System.currentTimeMillis() + "_" + sanitizedFilename;

                Path uploadDir = Paths.get("uploads/profile-images");
                if (!Files.exists(uploadDir)) {
                    Files.createDirectories(uploadDir);
                }

                Path filePath = uploadDir.resolve(newFilename);
                Files.copy(profileImage.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

                // ✅ Save image per STAGIAIRE (by ID)
                String fileUrl = "/profile-images/" + newFilename;
                profileDTO.setProfileImage(fileUrl);

            } catch (IOException ex) {
                return ResponseEntity.badRequest().body("Failed to store file: " + ex.getMessage());
            }
        }

        stagiaireProfileService.updateStagiaireProfile(tokenUserId, profileDTO);
        return ResponseEntity.ok("Stagiaire profile updated successfully.");
    }

    @GetMapping
    public ResponseEntity<StagiaireProfileDTO> getStagiaireProfile(HttpServletRequest request) {
        Long tokenUserId = (Long) request.getAttribute("userId");
        String role = (String) request.getAttribute("role");

        if (!UserRole.STAGIAIRE.name().equals(role)) {
            return ResponseEntity.status(403).body(null);
        }

        StagiaireProfileDTO profileDTO = stagiaireProfileService.getStagiaireProfile(tokenUserId);
        return ResponseEntity.ok(profileDTO);
    }
}
