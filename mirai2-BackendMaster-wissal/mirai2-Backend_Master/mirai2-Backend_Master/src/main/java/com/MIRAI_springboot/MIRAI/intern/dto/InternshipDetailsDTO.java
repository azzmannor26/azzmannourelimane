package com.MIRAI_springboot.MIRAI.intern.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InternshipDetailsDTO {
    private String companyName; // Name of the company or department
    private String role; // Internship role (e.g., "Frontend Developer Intern")
    private String period; // Internship period (e.g., "June 1, 2023 - December 31, 2023")
    private Boolean isPaid; // Paid or unpaid internship
    private String stipend; // Payment details
    private String supervisorName; // Supervisor's name
    private String supervisorEmail; // Supervisor's email
    private String location; // Internship location (e.g., "Remote")
    private String contractStatus; // Always "Signed"
}
