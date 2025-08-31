package com.finetrack.project.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class CreateProjectRequest {

    @NotBlank(message = "Project name is required")
    private String name;

    private String costCenterCode;   // Optional
    private String managerId;        // User ID of manager

    private String description;      // Project description
    private Double budget;           // Project budget
    private List<String> employeeEmails; // Employee emails assigned to the project
}
