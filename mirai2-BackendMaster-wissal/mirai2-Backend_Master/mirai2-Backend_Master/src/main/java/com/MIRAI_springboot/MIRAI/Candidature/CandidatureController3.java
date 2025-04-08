package com.MIRAI_springboot.MIRAI.Candidature;

import com.MIRAI_springboot.MIRAI.entities.Candidature;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.*;

@RestController
@RequestMapping("/api")
public class CandidatureController3 {

    @Autowired
    private CandidatureService3 candidatureService;

    @PostMapping("/submitForm")
    public ResponseEntity<String> submitForm(
            @RequestParam("username") String username,
            @RequestParam("email") String email,  // Added email parameter
            @RequestParam("department") String department,
            @RequestParam("degree") String degree,
            @RequestParam("dureestage") String dureestage,
            @RequestParam("typeInternship") String typeInternship,
            @RequestParam("cv") MultipartFile cv,
            @RequestParam("lettremotivation") MultipartFile lettremotivation
    ) {
        try {
            String response = candidatureService.submitForm(username, email, department, degree, dureestage, typeInternship, cv, lettremotivation);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error submitting form: " + e.getMessage());
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<Map<String, Object>>> getAllCandidatures() {
        List<Candidature> candidatures = candidatureService.getAllCandidatures();
        List<Map<String, Object>> response = new ArrayList<>();
        for (Candidature candidature : candidatures) {
            Map<String, Object> candidatureMap = new HashMap<>();
            candidatureMap.put("id", candidature.getId());
            candidatureMap.put("cv", candidature.getCv());
            candidatureMap.put("degree", candidature.getDegree());
            candidatureMap.put("dureedestage", candidature.getDureedestage());
            candidatureMap.put("lettremotivation", candidature.getLettremotivation());
            candidatureMap.put("typeinternship", candidature.getTypeinternship());
            candidatureMap.put("statut", candidature.getStatut().name());
            candidatureMap.put("username", candidature.getUser().getUsername());
            candidatureMap.put("email", candidature.getUser().getEmail()); // Fetch email
            response.add(candidatureMap);
        }
        return ResponseEntity.ok(response);
    }
}
