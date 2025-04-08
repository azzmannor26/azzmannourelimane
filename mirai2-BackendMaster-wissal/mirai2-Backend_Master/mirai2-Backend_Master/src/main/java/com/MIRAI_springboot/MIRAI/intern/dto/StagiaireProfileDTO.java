package com.MIRAI_springboot.MIRAI.intern.dto;

import lombok.Data;

@Data
public class StagiaireProfileDTO {
    private String username; // Full name
    private String email;
    private String phoneNumber;
    private String city;
    private String department;
    private String profileImage;
}
