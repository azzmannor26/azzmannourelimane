package com.finetrack.project.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ProjectResponse {

    private String id;
    private String name;
    private String costCenterCode;
    private String managerId;
    private boolean active;
    private String description;  // Include description
    private Double budget;       // Include budget

    public ProjectResponse(String id, String name, String costCenterCode, String managerId, boolean active, String description, Double budget, List<String> employeeEmails) {
        this.id = id;
        this.name = name;
        this.costCenterCode = costCenterCode;
        this.managerId = managerId;
        this.active = active;
        this.description = description;
        this.budget = budget;
    }
}
