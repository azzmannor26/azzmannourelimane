package com.MIRAI_springboot.MIRAI.entities;

import com.MIRAI_springboot.MIRAI.entities.ENUMS.RapportStatus;
import com.MIRAI_springboot.MIRAI.entities.ENUMS.Status;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "candidature")
public class Candidature {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String degree;
    private String cv;
    private String lettremotivation;
    private String dureedestage;
    private String typeinternship;

    @Enumerated(EnumType.STRING)
    private RapportStatus statut;

    @ManyToOne
    @JoinColumn(name = "users_id")
    private User user;

    public void setValidee(boolean b) {
    }

    public void setDureedestage(String dureedestage) {
        this.dureedestage = dureedestage;
    }

    public void setDureestage(String dureestage) {
        this.dureedestage=dureestage;
    }

    public void setTypeInternship(String typeInternship) {
        this.typeinternship = typeInternship;
    }

    public Long getUsersId() {
        return this.user != null ? this.user.getId() : null;
    }
}
