package gestion_ecole.gestion_academique_springboot.model;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;
import java.util.Date;

@Data
@Entity
public class DossierAdministratif {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String numeroInscription;

    @Column(name = "date_creation")
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate dateCreation;

    //un dossier pour un eleve
    @OneToOne
    @JoinColumn(name = "eleve_id")
    private Eleve eleve;
}