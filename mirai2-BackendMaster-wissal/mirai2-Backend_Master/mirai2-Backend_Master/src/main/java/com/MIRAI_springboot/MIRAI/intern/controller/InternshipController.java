package com.MIRAI_springboot.MIRAI.intern.controller;

import com.MIRAI_springboot.MIRAI.intern.dto.InternshipDetailsDTO;
import com.MIRAI_springboot.MIRAI.intern.service.InternshipService;
import com.MIRAI_springboot.MIRAI.entities.ENUMS.UserRole;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/internship")
public class InternshipController {

    private final InternshipService internshipService;

    public InternshipController(InternshipService internshipService) {
        this.internshipService = internshipService;
    }

    @GetMapping("/{stagiaireId}")
    public ResponseEntity<InternshipDetailsDTO> getInternshipDetails(
            @PathVariable Long stagiaireId,
            HttpServletRequest request
    ) {
        Long tokenUserId = (Long) request.getAttribute("userId");
        String role = (String) request.getAttribute("role");

        // Allow only STAGIAIRE role and validate the user ID
        if (!UserRole.STAGIAIRE.name().equals(role) || !tokenUserId.equals(stagiaireId)) {
            return ResponseEntity.status(403).body(null);
        }

        InternshipDetailsDTO internshipDetails = internshipService.getInternshipDetails(stagiaireId);
        return ResponseEntity.ok(internshipDetails);
    }
}
