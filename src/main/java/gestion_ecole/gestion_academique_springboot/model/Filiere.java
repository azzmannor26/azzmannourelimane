package gestion_ecole.gestion_academique_springboot.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
@Entity
public class Filiere {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String codeFiliere;
    private String nomFiliere;
    private String description;

    //une filiere contient plusieurs eleves
    @OneToMany(mappedBy = "filiere")
    private List<Eleve> eleves;

    @ManyToMany(mappedBy = "filieres")
    private List<Cours> cours = new ArrayList<>();


    @Override
    public String toString() {
        return "Filiere{id=" + id + ", codeFiliere='" + codeFiliere + "', nomFiliere='" + nomFiliere + "', description='" + description + "'}";
    }

}

