package com.MIRAI_springboot.MIRAI.entities;

import com.MIRAI_springboot.MIRAI.entities.ENUMS.RapportStatus;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "rapport")
public class Rapport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String nom;     // title or name

    @Enumerated(EnumType.STRING)
    private RapportStatus type;    // e.g. "Stage Report", "Evaluation"
    private String contenu; // can store text or path to doc

    // If each Rapport belongs to exactly 1 Stage:
    @ManyToOne
    @JoinColumn(name = "stagiaire_id", nullable = false)
    private stagiaire stagiaire;
    @ManyToOne
    @JoinColumn(name = "superviseur_id")
    private superviseur superviseur;
}
