package com.MIRAI_springboot.MIRAI.entities;
import com.MIRAI_springboot.MIRAI.entities.ENUMS.Status;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;

@Entity
@Table(name = "tache")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Tache {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String description;
    private LocalDate dateEcheance;

    @Enumerated(EnumType.STRING)
    private Status statut;

    // Which stagiaire is assigned this Tache
    @ManyToOne
    @JoinColumn(name = "stagiaire_id", nullable = false)
    private stagiaire stagiaire;  // 1:n from Stagiaire -> Tache

    // Which superviseur created / validated / assigned it
    @ManyToOne
    @JoinColumn(name = "superviseur_id")
    private superviseur superviseur;
}
