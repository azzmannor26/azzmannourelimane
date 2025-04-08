package com.MIRAI_springboot.MIRAI.Candidature;

import com.MIRAI_springboot.MIRAI.entities.Candidature;
import com.MIRAI_springboot.MIRAI.entities.ENUMS.RapportStatus;
import com.MIRAI_springboot.MIRAI.entities.User;
import com.MIRAI_springboot.MIRAI.RH1.CandidatureRepository;
import com.MIRAI_springboot.MIRAI.RH1.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;

@Service
public class CandidatureService3 {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CandidatureRepository candidatureRepository;

    private static final String UPLOAD_DIR = "cv/";

    public String submitForm(String username, String email, String department, String degree, String dureestage, String typeInternship, MultipartFile cv, MultipartFile lettremotivation) throws IOException {
        // Ensure upload directory exists
        Files.createDirectories(Paths.get(UPLOAD_DIR));

        // Save files
        String cvFilename = saveFile(cv);
        String motivationFilename = saveFile(lettremotivation);

        // Retrieve or create the user with email
        Optional<User> existingUser = userRepository.findByUsername(username);
        User user = existingUser.orElseGet(() -> {
            User newUser = new User();
            newUser.setUsername(username);
            newUser.setEmail(email); // Save email
            newUser.setDepartment(department);
            return userRepository.save(newUser);
        });

        // Update email if user exists but has no email
        if (existingUser.isPresent() && (user.getEmail() == null || user.getEmail().isEmpty())) {
            user.setEmail(email);
            userRepository.save(user);
        }

        // Create and save the candidature
        Candidature candidature = new Candidature();
        candidature.setCv(cvFilename);
        candidature.setDegree(degree);
        candidature.setDureedestage(dureestage);
        candidature.setLettremotivation(motivationFilename);
        candidature.setTypeInternship(typeInternship);
        candidature.setUser(user);
        candidature.setStatut(RapportStatus.under_review);

        candidatureRepository.save(candidature);
        return "Form submitted successfully";
    }

    private String saveFile(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            return null;
        }
        String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path path = Paths.get(UPLOAD_DIR, filename);
        Files.write(path, file.getBytes());
        return filename;
    }

    public List<Candidature> getAllCandidatures() {
        return candidatureRepository.findAll();
    }
}
