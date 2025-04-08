package com.MIRAI_springboot.MIRAI.intern.controller;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class CertificationDTO {
    private Long id;
    private String username;         // Provient de la table users
    private String typedocument;     // Correspond à certificate_path
    private String status;           // ACCEPTED, REJECTED, etc.
}
