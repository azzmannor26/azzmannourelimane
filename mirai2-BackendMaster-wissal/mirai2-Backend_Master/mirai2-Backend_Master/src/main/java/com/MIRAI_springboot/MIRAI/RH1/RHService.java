package com.MIRAI_springboot.MIRAI.RH1;

import com.MIRAI_springboot.MIRAI.DTO.StagiaireDTO;
import com.MIRAI_springboot.MIRAI.Mapper.StagiaireMapper;
import com.MIRAI_springboot.MIRAI.email.EmailService;
import com.MIRAI_springboot.MIRAI.entities.*;
import com.MIRAI_springboot.MIRAI.entities.ENUMS.RapportStatus;
import com.MIRAI_springboot.MIRAI.entities.ENUMS.UserRole;
import com.MIRAI_springboot.MIRAI.superviseur.AvailabilityRepository;
import com.MIRAI_springboot.MIRAI.superviseur.StagiaireSupervRepository;
import jakarta.persistence.EntityNotFoundException;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class RHService {

    // Repositories
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private CandidatureRepository candidatureRepository;
    @Autowired
    private StagiaireSupervRepository stagiaireRepository;
    @Autowired
    private RHRepository rhRepository;
    @Autowired
    private SuperviseurRepository superviseurRepository;

    @Autowired
    private  AvailabilityRepository availabilityRepository;
    @Autowired
    private StageRepository2 stageRepository2;

    // Mappers
    @Autowired
    private StagiaireMapper stagiaireMapper;

    @Autowired
    private EmailService emailService;

    // Method to get all availabilities of all supervisors
    public List<Object[]> getAllSupervisorsAvailabilities() {
        return availabilityRepository.findAllSupervisorsAvailabilities();
    }


    private String generateRandomPassword() {
        // Simple random password generator (customize as needed)
        int length = 8;
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        StringBuilder password = new StringBuilder();
        java.util.Random random = new java.util.Random();

        for (int i = 0; i < length; i++) {
            password.append(characters.charAt(random.nextInt(characters.length())));
        }
        return password.toString();
    }



    // 2. Stagiaire Management
    public List<stagiaire> getAllStagiaires() {
        return stagiaireRepository.findAll();
    }

    public StagiaireDTO getStagiaireById(Long id) {
        stagiaire stagiaire = stagiaireRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Stagiaire introuvable avec l'id : " + id));
        return stagiaireMapper.toStagiaireDTO(stagiaire);
    }

    public void assignStagiaireToSuperviseur(Long stagiaireId, Long superviseurId) {
        stagiaire stagiaire = stagiaireRepository.findById(stagiaireId)
                .orElseThrow(() -> new EntityNotFoundException("Stagiaire introuvable avec l'id : " + stagiaireId));

        superviseur superviseur = superviseurRepository.findById(superviseurId)
                .orElseThrow(() -> new EntityNotFoundException("Superviseur introuvable avec l'id : " + superviseurId));

        stagiaire.setSuperviseur(superviseur);
        stagiaireRepository.save(stagiaire);
        superviseurRepository.save(superviseur);
    }

    // 3. RH Management
    public Iterable<RH> getAllRH() {
        return rhRepository.findAll();
    }

    public RH getRHById(Long id) {
        return rhRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("RH introuvable avec l'ID : " + id));
    }

    public RH updateProfile(Long id, RH updatedRH) {
        RH rh = rhRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Utilisateur introuvable"));

        if (updatedRH.getEmail() != null) {
            rh.setEmail(updatedRH.getEmail());
        }
        if (updatedRH.getUsername() != null) {
            rh.setUsername(updatedRH.getUsername());
        }
        if (updatedRH.getPassword() != null) {
            rh.setPassword(updatedRH.getPassword());
        }
        return rhRepository.save(rh);
    }



    public void validerCandidature(Long candidatureId) {
        // ✅ Step 1: Retrieve the candidature by ID
        Candidature candidature = candidatureRepository.findById(candidatureId)
                .orElseThrow(() -> new EntityNotFoundException("❌ Candidature introuvable avec l'ID : " + candidatureId));

        // ✅ Step 2: Retrieve the associated user
        User user = userRepository.findById(candidature.getUsersId())
                .orElseThrow(() -> new EntityNotFoundException("❌ Utilisateur introuvable avec l'ID : " + candidature.getUsersId()));

        // ✅ Step 3: Generate a username and a secure password
        String generatedUsername = "stagiaire" + user.getId(); // e.g., stagiaire5
        String rawPassword = generateRandomPassword(); // Generate a random password

        // 🔐 Encrypt the password using bcrypt
        String encryptedPassword = BCrypt.hashpw(rawPassword, BCrypt.gensalt());

        // 🔄 Step 4: Update user information
        user.setUsername(generatedUsername);
        user.setPassword(encryptedPassword);
        user.setRole(UserRole.STAGIAIRE); // Assign the STAGIAIRE role
        userRepository.save(user);

        // 📋 Step 5: Update candidature status to "accepted"
        candidature.setStatut(RapportStatus.accepted);
        candidatureRepository.save(candidature);

        // 👤 Step 6: Insert user into stagiaire table if not already present
        if (!stagiaireRepository.existsById(user.getId())) {
            stagiaireRepository.insertStagiaireId(user.getId());
        }

        // 📧 Step 7: Send credentials via email
        emailService.sendEmail(user.getEmail(), "Votre compte stagiaire est activé",
                "Bonjour,\n\nVotre candidature a été validée. Voici vos informations de connexion :\n" +
                        "Nom d'utilisateur : " + generatedUsername + "\n" +
                        "Mot de passe : " + rawPassword + " (chiffré en base de données)\n\n" +
                        "Merci de vous connecter et de changer votre mot de passe dès que possible.\n\nCordialement,\nL'équipe RH.");

        // ✅ Debug log
        System.out.println("✅ Candidature ID " + candidatureId + " validée avec succès pour l'utilisateur ID " + user.getId());
    }


    public List<Map<String, Object>> getAllSupervisors() {
        List<Object[]> results = rhRepository.findAllSupervisorsWithDetails();
        List<Map<String, Object>> supervisorsList = new ArrayList<>();

        for (Object[] row : results) {
            Map<String, Object> supervisor = new HashMap<>();
            supervisor.put("username", row[0]);   // Nom d'utilisateur
            supervisor.put("email", row[1]);      // Email
            supervisor.put("department", row[2]); // Département
            supervisor.put("poste", row[3]);      // Poste
            supervisorsList.add(supervisor);
        }
        return supervisorsList;
    }

    @Transactional
    public Stage assignInternToSupervisor(Long stagiaireId, Long superviseurId, Stage stageDetails) {
        // ✅ Step 1: Retrieve Stagiaire
        stagiaire stagiaire = stagiaireRepository.findById(stagiaireId)
                .orElseThrow(() -> new EntityNotFoundException("❌ Stagiaire introuvable avec l'ID : " + stagiaireId));

        // ✅ Step 2: Retrieve Superviseur
        superviseur superviseur = superviseurRepository.findById(superviseurId)
                .orElseThrow(() -> new EntityNotFoundException("❌ Superviseur introuvable avec l'ID : " + superviseurId));

        // ✅ Step 3: Assign Supervisor to Intern
        stagiaire.setSuperviseur(superviseur);
        stagiaireRepository.save(stagiaire);

        // ✅ Step 4: Create Internship (Stage) Record
        Stage newStage = new Stage();
        newStage.setContractStatus(stageDetails.getContractStatus());
        newStage.setDateDebut(stageDetails.getDateDebut());
        newStage.setDateFin(stageDetails.getDateFin());
        newStage.setDepartement(stageDetails.getDepartement());
        newStage.setIsPaid(stageDetails.getIsPaid());
        newStage.setLocation(stageDetails.getLocation());
        newStage.setStipend(stageDetails.getStipend());
        newStage.setSujet(stageDetails.getSujet());
        newStage.setEncadrant(superviseur);
        newStage.setStagiaire(stagiaire);

        // ✅ Save Internship Record in Stage Table
        return stageRepository2.save(newStage);
    }

    public List<Map<String, Object>> getSupervisorsid() {
        List<Object[]> results = rhRepository.findAllSupervisorsWithid();
        List<Map<String, Object>> supervisorsList = new ArrayList<>();

        for (Object[] row : results) {
            Map<String, Object> supervisor = new HashMap<>();

            // ✅ Fixing the incorrect index mapping
            supervisor.put("userId", ((Number) row[0]).longValue()); // User ID
            supervisor.put("username", (String) row[1]); // Username

            supervisorsList.add(supervisor);
        }
        return supervisorsList;
    }


    public List<Map<String, Object>> getAllInternships() {
        List<Object[]> results = stageRepository2.findAllInternshipsWithDetails();
        List<Map<String, Object>> internshipList = new ArrayList<>();

        for (Object[] row : results) {
            Map<String, Object> internship = new HashMap<>();
            internship.put("id", row[0]);
            internship.put("contractStatus", row[1]);
            internship.put("dateDebut", row[2]);
            internship.put("dateFin", row[3]);
            internship.put("departement", row[4]);
            internship.put("isPaid", row[5]);
            internship.put("location", row[6]);
            internship.put("stipend", row[7]);
            internship.put("sujet", row[8]);
            internship.put("superviseurName", row[9]); // Supervisor Name
            internship.put("stagiaireName", row[10]); // Intern Name
            internshipList.add(internship);
        }

        return internshipList;
    }


}
