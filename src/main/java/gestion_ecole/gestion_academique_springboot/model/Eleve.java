package gestion_ecole.gestion_academique_springboot.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Eleve {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String matricule;
    private String nomEleve;
    private String prenomEleve;
    private String email;

    //plusiers eleves dans une filiere
    @ManyToOne
    @JoinColumn(name = "filiere_id")
    private Filiere filiere;

    // Getters and Setters
    @Override
    public String toString() {
        return "Eleve{id=" + id + ", matricule='" + matricule + "', nomEleve='" + nomEleve + "', prenomEleve='" + prenomEleve + "', email='" + email + "', filiere=" + (filiere != null ? filiere.getNomFiliere() : "null") + "}";
    }
}
