package com.finetrack.project.domain;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Document("projects")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Project {

    @Id
    private String id;

    @Indexed
    private String name;

    private String costCenterCode;  // Optional field for cost center code
    private String managerId;       // Store the manager's user ID

    private String description;     // Project description
    private Double budget;          // Project budget

    @Builder.Default
    private boolean active = true;

    @Builder.Default
    private Instant createdAt = Instant.now();

    @Builder.Default
    private List<String> employeeEmails = new ArrayList<>(); // Initialize with empty list

}
