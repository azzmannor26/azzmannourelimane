package com.MIRAI_springboot.MIRAI.entities;
import jakarta.persistence.*;
import lombok.*;
import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "stage")
public class Stage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Temporal(TemporalType.DATE)
    private Date dateDebut;

    @Temporal(TemporalType.DATE)
    private Date dateFin;

    private String sujet;

    private String departement;

    private Boolean isPaid;

    private String stipend;

    private String location;

    private String contractStatus; // "Signed", "Pending", etc.

    @OneToOne
    @JoinColumn(name = "stagiaire_id")
    private stagiaire stagiaire;

    @ManyToOne
    @JoinColumn(name = "superviseur_id")
    private superviseur encadrant;
}