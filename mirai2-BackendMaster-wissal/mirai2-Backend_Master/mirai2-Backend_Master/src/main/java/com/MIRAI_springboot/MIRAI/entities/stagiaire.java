package com.MIRAI_springboot.MIRAI.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@SuperBuilder
@Entity
@Table(name = "stagiaire")
@PrimaryKeyJoinColumn(name = "users_id")
@NoArgsConstructor
//@AllArgsConstructor  // references user(id)
public class stagiaire extends User {

    @Column(length = 15)
    private String phoneNumber; // Phone number specific to stagiaire

    @Column(length = 255)
    private String profileImage; // Profile image URL or path

    @JsonBackReference // Prevent serialization of tasks when serializing stagiaire
    private String city; // City specific to stagiaire

    @ManyToOne
    @JoinColumn(name = "superviseur_id", referencedColumnName = "id")
    private superviseur superviseur;
}
