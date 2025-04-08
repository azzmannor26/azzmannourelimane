// InternshipService.java
package com.MIRAI_springboot.MIRAI.intern.service;

import com.MIRAI_springboot.MIRAI.intern.dto.InternshipDetailsDTO;
import com.MIRAI_springboot.MIRAI.entities.Stage;
import com.MIRAI_springboot.MIRAI.entities.stagiaire;
import com.MIRAI_springboot.MIRAI.intern.repository.StageRepository;
import com.MIRAI_springboot.MIRAI.intern.repository.StagiaireRepository;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;

@Service
public class InternshipService {

    private final StageRepository stageRepository;
    private final StagiaireRepository stagiaireRepository;

    public InternshipService(StageRepository stageRepository, StagiaireRepository stagiaireRepository) {
        this.stageRepository = stageRepository;
        this.stagiaireRepository = stagiaireRepository;
    }

    public InternshipDetailsDTO getInternshipDetails(Long stagiaireId) {
        stagiaire stagiaire = stagiaireRepository.findById(stagiaireId)
                .orElseThrow(() -> new RuntimeException("Stagiaire not found with ID: " + stagiaireId));

        Stage stage = stageRepository.findByStagiaire(stagiaire)
                .orElseThrow(() -> new RuntimeException("No internship found for this stagiaire."));

        String period = new SimpleDateFormat("MMMM d, yyyy").format(stage.getDateDebut())
                + " - " + new SimpleDateFormat("MMMM d, yyyy").format(stage.getDateFin());

        return new InternshipDetailsDTO(
                stage.getEncadrant().getDepartement(),
                stage.getSujet(),
                period,
                stage.getIsPaid(),
                stage.getStipend(),
                stage.getEncadrant().getUsername(),
                stage.getEncadrant().getEmail(),
                stage.getLocation(),
                "Signed"
        );
    }
}
