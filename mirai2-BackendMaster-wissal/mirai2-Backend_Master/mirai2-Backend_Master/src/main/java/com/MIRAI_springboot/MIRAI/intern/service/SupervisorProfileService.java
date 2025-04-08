package com.MIRAI_springboot.MIRAI.intern.service;

import com.MIRAI_springboot.MIRAI.entities.superviseur;
import com.MIRAI_springboot.MIRAI.entities.stagiaire;
import com.MIRAI_springboot.MIRAI.exception.ResourceNotFoundException;
import com.MIRAI_springboot.MIRAI.intern.repository.StagiaireRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SupervisorProfileService {

    private final StagiaireRepository stagiaireRepository;

    /**
     * Fetch the supervisor profile assigned to the authenticated stagiaire.
     *
     * @param authenticatedStagiaireId the ID of the authenticated stagiaire
     * @return superviseur profile details
     */
    public superviseur getSupervisorProfileForAuthenticatedStagiaire(Long authenticatedStagiaireId) {
        // Fetch the authenticated stagiaire using their ID from the token
        stagiaire stagiaire = stagiaireRepository.findById(authenticatedStagiaireId)
                .orElseThrow(() -> new ResourceNotFoundException("Stagiaire not found with ID: " + authenticatedStagiaireId));

        // Fetch and validate the assigned supervisor
        superviseur supervisor = stagiaire.getSuperviseur();
        if (supervisor == null) {
            throw new ResourceNotFoundException("No supervisor assigned for Stagiaire with ID: " + authenticatedStagiaireId);
        }

        return supervisor;
    }
}
