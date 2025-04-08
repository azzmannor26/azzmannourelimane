package com.MIRAI_springboot.MIRAI.intern.service;

import com.MIRAI_springboot.MIRAI.entities.Certification;
import com.MIRAI_springboot.MIRAI.entities.ENUMS.RapportStatus;
import com.MIRAI_springboot.MIRAI.entities.RH;
import com.MIRAI_springboot.MIRAI.entities.stagiaire;
import com.MIRAI_springboot.MIRAI.exception.ResourceNotFoundException;
import com.MIRAI_springboot.MIRAI.intern.repository.CertificationRepository;
import com.MIRAI_springboot.MIRAI.intern.repository.RHinternRepository;
import com.MIRAI_springboot.MIRAI.intern.repository.StagiaireRepository;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfWriter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.*;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class CertificationService {

    private final CertificationRepository certificationRepository;
    private final StagiaireRepository stagiaireRepository;
    private final RHinternRepository rhRepository;

    /**
     * Fetch the single RH entity (there is only one RH).
     */
    private RH getSingleRH() {
        return rhRepository.findAll().stream()
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("No RH found in the system"));
    }

    /**
     * Stagiaire requests a new Certification.
     */
    public Certification createCertification(Long stagiaireId) {
        // Retrieve the stagiaire
        stagiaire stg = stagiaireRepository.findById(stagiaireId)
                .orElseThrow(() -> new ResourceNotFoundException("Stagiaire not found with ID " + stagiaireId));

        // Automatically assign the single RH
        RH rh = getSingleRH();

        // Create a new certification
        Certification certification = new Certification();
        certification.setStatus(RapportStatus.under_review);
        certification.setStagiaire(stg);
        certification.setRh(rh);
        certification.setCertificatePath(null); // remains null until accepted

        return certificationRepository.save(certification);
    }

    /**
     * Get a specific Certification by ID.
     */
    public Certification getCertificationById(Integer certificationId) {
        return certificationRepository.findById(certificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Certification not found with ID " + certificationId));
    }

    /**
     * List all Certifications.
     */
    public List<Certification> getAllCertifications() {
        return certificationRepository.findAll();
    }

    /**
     * Update a Certification's status by the RH.
     */
    public Certification updateCertificationStatus(Integer certificationId, RapportStatus newStatus) {
        Certification cert = getCertificationById(certificationId);

        // Validate that the RH exists
        getSingleRH();

        cert.setStatus(newStatus);

        // If accepted, generate a PDF in /uploads/
        if (newStatus == RapportStatus.accepted) {
            String generatedPath = generateCertificateFile(cert);
            cert.setCertificatePath(generatedPath);
        } else {
            // If REJECTED or UNDER_REVIEW
            cert.setCertificatePath(null);
        }

        Certification updated = certificationRepository.save(cert);
        log.info("Certification ID {} status updated to {}", certificationId, newStatus);
        return updated;
    }

    /**
     * Generate a styled PDF in "uploads/" that includes the Stagiaire's name, etc.
     */
    private String generateCertificateFile(Certification cert) {
        Path uploadsDir = Paths.get("src/main/resources/uploads");
        try {
            if (!Files.exists(uploadsDir)) {
                Files.createDirectories(uploadsDir);
                log.info("Created uploads directory: {}", uploadsDir.toAbsolutePath());
            }
        } catch (IOException e) {
            log.error("Failed to create 'uploads' directory: {}", e.getMessage());
            throw new RuntimeException("Failed to create 'uploads' directory", e);
        }

        Integer certId = cert.getId();
        String fileName = "certificate_" + certId + ".pdf";
        Path certificatePath = uploadsDir.resolve(fileName);

        try (FileOutputStream fos = new FileOutputStream(certificatePath.toFile())) {
            Document document = new Document();
            PdfWriter.getInstance(document, fos);
            document.open();

            Font titleFont = new Font(Font.FontFamily.HELVETICA, 26, Font.BOLD);
            Font subTitleFont = new Font(Font.FontFamily.HELVETICA, 18, Font.BOLD);
            Font textFont = new Font(Font.FontFamily.TIMES_ROMAN, 14, Font.NORMAL);
            Font italicFont = new Font(Font.FontFamily.TIMES_ROMAN, 12, Font.ITALIC);

            // Title
            Paragraph title = new Paragraph("CERTIFICATE OF COMPLETION\n\n", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);

            // SubTitle
            Paragraph subTitle = new Paragraph("This is to certify that\n", subTitleFont);
            subTitle.setAlignment(Element.ALIGN_CENTER);
            document.add(subTitle);

            // Stagiaire Name
            String stagiaireName = cert.getStagiaire().getUsername();
            Paragraph name = new Paragraph(stagiaireName + "\n\n",
                    new Font(Font.FontFamily.COURIER, 20, Font.BOLD));
            name.setAlignment(Element.ALIGN_CENTER);
            document.add(name);

            // Body
            Paragraph body = new Paragraph(
                    "Has successfully completed the internship under the supervision of "
                            + cert.getRh().getUsername() + ".\n"
                            + "We hereby acknowledge the hard work and dedication put forth.\n\n",
                    textFont
            );
            body.setAlignment(Element.ALIGN_CENTER);
            document.add(body);

            // Date
            java.time.LocalDate today = java.time.LocalDate.now();
            Paragraph dateParagraph = new Paragraph("Date of Issue: " + today.toString() + "\n\n", textFont);
            dateParagraph.setAlignment(Element.ALIGN_CENTER);
            document.add(dateParagraph);

            // Signature
            Paragraph signature = new Paragraph(
                    "RH Signature:\n\n   [Mirai]\n\n\n",
                    italicFont
            );
            signature.setAlignment(Element.ALIGN_CENTER);
            document.add(signature);

            // Closing Note
            Paragraph closing = new Paragraph(
                    "Thank you for your outstanding effort.\n\n",
                    textFont
            );
            closing.setAlignment(Element.ALIGN_CENTER);
            document.add(closing);

            document.close();
        } catch (Exception e) {
            log.error("Error writing PDF for cert {}: {}", certId, e.getMessage(), e);
            throw new RuntimeException("Failed to generate certificate PDF", e);
        }

        return certificatePath.toAbsolutePath().toString();
    }
    //new
    public Certification getLatestCertificationForStagiaire(Long stagiaireId) {
        return certificationRepository.findTopByStagiaire_IdOrderByIdDesc(stagiaireId);
    }

}
