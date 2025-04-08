package com.MIRAI_springboot.MIRAI.intern.controller;

import com.MIRAI_springboot.MIRAI.entities.ENUMS.UserRole;
import com.MIRAI_springboot.MIRAI.entities.superviseur;
import com.MIRAI_springboot.MIRAI.intern.service.SupervisorProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.Map;

@RestController
@RequestMapping("/supervisor/profile")
@RequiredArgsConstructor
public class SupervisorProfileController {

    private final SupervisorProfileService supervisorProfileService;

    /**
     * GET /api/supervisor/profile
     * Fetch the supervisor profile information assigned to the authenticated stagiaire.
     *
     * @param request HttpServletRequest containing the authenticated user's details
     * @return ResponseEntity containing supervisor details
     */
    @GetMapping
    public ResponseEntity<?> getSupervisorProfile(HttpServletRequest request) {
        Long tokenUserId = (Long) request.getAttribute("userId");
        String role = (String) request.getAttribute("role");

        // Allow only STAGIAIRE role to access this endpoint
        if (!UserRole.STAGIAIRE.name().equals(role)) {
            return ResponseEntity.status(403).body(Map.of("error", "Access denied: Only interns can view this information."));
        }

        // Fetch the supervisor profile for the authenticated stagiaire
        superviseur supervisor = supervisorProfileService.getSupervisorProfileForAuthenticatedStagiaire(tokenUserId);

        if (supervisor == null) {
            return ResponseEntity.status(404).body(Map.of("error", "Supervisor not found."));
        }

        // Return the needed data as JSON
        return ResponseEntity.ok(Map.of(
                "id", supervisor.getId(),
                "username", supervisor.getUsername(),
                "email", supervisor.getEmail(),
                "departement", supervisor.getDepartement(),
                "poste", supervisor.getPoste()
        ));
    }
}
