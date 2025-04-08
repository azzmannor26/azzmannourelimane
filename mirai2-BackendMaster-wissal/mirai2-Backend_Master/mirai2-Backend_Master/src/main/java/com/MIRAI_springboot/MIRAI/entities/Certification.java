package com.MIRAI_springboot.MIRAI.entities;


import com.MIRAI_springboot.MIRAI.entities.ENUMS.RapportStatus;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name = "certifications")
public class Certification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "stagiaire_id", nullable = false)
    private stagiaire stagiaire;

    @ManyToOne
    @JoinColumn(name = "rh_id") // Reference to RH
    private RH rh;

    @Enumerated(EnumType.STRING)
    private RapportStatus status;

    private String certificatePath; // Path of the generated certificate
}
