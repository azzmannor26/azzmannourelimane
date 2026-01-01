package gestion_ecole.gestion_academique_springboot.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
public class Cours {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String codeCours;
    private String intitule;

    //plusiers filieres contiennent plusieurs cours
    @ManyToMany
    @JoinTable(
            name = "cours_filiere",
            joinColumns = @JoinColumn(name = "cours_id"),
            inverseJoinColumns = @JoinColumn(name = "filiere_id")
    )
    private List<Filiere> filieres = new ArrayList<>();


    //plusieurs cours ont plusieurs eleves
    @ManyToMany
    @JoinTable(
            name = "eleve_cours",
            joinColumns = @JoinColumn(name = "cours_id"),
            inverseJoinColumns = @JoinColumn(name = "eleve_id")
    )
    private List<Eleve> eleves = new ArrayList<>();


    public Cours() {
        this.filieres = new ArrayList<>();
        this.eleves = new ArrayList<>();
    }


    public List<Filiere> getFilieres() {
        if (this.filieres == null) {
            this.filieres = new ArrayList<>();
        }
        return this.filieres;
    }

    public void setFilieres(List<Filiere> filieres) {
        this.filieres = filieres != null ? filieres : new ArrayList<>();
    }
}