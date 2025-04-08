package com.MIRAI_springboot.MIRAI.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StagiaireDTO {
    private String username;
    private String email;
    private String departement;
    private
    SuperviseurDTO superviseur;
}
