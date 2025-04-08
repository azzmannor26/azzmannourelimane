package com.MIRAI_springboot.MIRAI.Mapper;
import com.MIRAI_springboot.MIRAI.DTO.StagiaireDTO;
import com.MIRAI_springboot.MIRAI.DTO.SuperviseurDTO;
import com.MIRAI_springboot.MIRAI.entities.stagiaire;
import com.MIRAI_springboot.MIRAI.entities.superviseur;
import org.springframework.stereotype.Component;

@Component
public class StagiaireMapper {

    // Méthode pour mapper un superviseur en DTO
    public SuperviseurDTO toSuperviseurDTO(superviseur superviseur) {
        if (superviseur == null) {
            return null; // Aucun superviseur
        }
        return new SuperviseurDTO(
                superviseur.getUsername(),
                superviseur.getPoste()
        );
    }

    // Méthode pour mapper un stagiaire en DTO
    public StagiaireDTO toStagiaireDTO(stagiaire stagiaire) {
        if (stagiaire == null) {
            return null;
        }
        return new StagiaireDTO(
                stagiaire.getUsername(),
                stagiaire.getEmail(),
                stagiaire.getDepartement(),
                toSuperviseurDTO(stagiaire.getSuperviseur()) // Mapper le superviseur
        );
    }
}
