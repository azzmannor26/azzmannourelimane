package com.MIRAI_springboot.MIRAI.entities;

import com.MIRAI_springboot.MIRAI.entities.ENUMS.UserRole;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@SuperBuilder
@Entity
@Table(name = "users")  // We'll name it "users" to avoid reserved keywords
@Inheritance(strategy = InheritanceType.JOINED) // Joined inheritance

@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Common fields
    @Column(nullable = true, length = 50)
    private String username;

    @Column( nullable = true,length = 100)
    private String password;

    @Column(length = 100, unique = true)
    private String email;

    @Column(length = 100)
    private String departement;

    // Option A: Role as an enum
    @Enumerated(EnumType.STRING)
    @Column(nullable = true,length = 20)
    private UserRole role;

    public void setSuperviseur(User superviseur) {
    }

    public void setDepartment(String department) {
        this.departement = department;
    }
}
