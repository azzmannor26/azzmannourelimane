package com.MIRAI_springboot.MIRAI.intern.service;

import com.MIRAI_springboot.MIRAI.intern.dto.StagiaireProfileDTO;
import com.MIRAI_springboot.MIRAI.entities.stagiaire;
import com.MIRAI_springboot.MIRAI.intern.repository.StagiaireRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class StagiaireProfileService {

    private final StagiaireRepository stagiaireRepository;

    public StagiaireProfileService(StagiaireRepository stagiaireRepository) {
        this.stagiaireRepository = stagiaireRepository;
    }

    // Update Stagiaire Profile (Only STAGIAIRE can change their own profile)
    public void updateStagiaireProfile(Long id, StagiaireProfileDTO profileDTO) {
        Optional<stagiaire> optionalStagiaire = stagiaireRepository.findById(id);
        if (optionalStagiaire.isPresent()) {
            stagiaire stagiaire = optionalStagiaire.get();

            // Basic fields update
            stagiaire.setUsername(profileDTO.getUsername());
            stagiaire.setEmail(profileDTO.getEmail());
            stagiaire.setPhoneNumber(profileDTO.getPhoneNumber());
            stagiaire.setCity(profileDTO.getCity());
            stagiaire.setDepartement(profileDTO.getDepartment());

            // ✅ Each stagiaire has their own unique profile image
            if (profileDTO.getProfileImage() != null) {
                stagiaire.setProfileImage(profileDTO.getProfileImage());
            }

            stagiaireRepository.save(stagiaire);
        } else {
            throw new RuntimeException("Stagiaire not found with ID: " + id);
        }
    }

    // Retrieve Stagiaire Profile (Only if user is STAGIAIRE)
    public StagiaireProfileDTO getStagiaireProfile(Long id) {
        Optional<stagiaire> optionalStagiaire = stagiaireRepository.findById(id);
        if (optionalStagiaire.isPresent()) {
            stagiaire stagiaire = optionalStagiaire.get();
            StagiaireProfileDTO profileDTO = new StagiaireProfileDTO();

            profileDTO.setUsername(stagiaire.getUsername());
            profileDTO.setEmail(stagiaire.getEmail());
            profileDTO.setPhoneNumber(stagiaire.getPhoneNumber());
            profileDTO.setCity(stagiaire.getCity());
            profileDTO.setDepartment(stagiaire.getDepartement());

            // ✅ Each stagiaire gets their own stored image
            profileDTO.setProfileImage(stagiaire.getProfileImage());

            return profileDTO;
        } else {
            throw new RuntimeException("Stagiaire not found with ID: " + id);
        }
    }
}
