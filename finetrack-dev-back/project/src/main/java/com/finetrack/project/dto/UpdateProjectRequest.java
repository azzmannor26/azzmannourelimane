package com.finetrack.project.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateProjectRequest {

    private String name;             // Optional
    private String costCenterCode;   // Optional
    private String managerId;        // Optional
    private Boolean active;          // Optional
    private String description;      // Optional
    private Double budget;           // Optional
}
