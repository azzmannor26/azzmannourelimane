package com.finetrack.project.service;

import com.finetrack.project.domain.Project;
import com.finetrack.project.dto.*;
import com.finetrack.project.repo.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository repo;

    // Create project with employee emails
    public ProjectResponse create(CreateProjectRequest r) {
        Project p = Project.builder()
                .name(r.getName())
                .costCenterCode(r.getCostCenterCode())
                .managerId(r.getManagerId())  // Ensure managerId is set
                .description(r.getDescription())
                .budget(r.getBudget())
                .employeeEmails(r.getEmployeeEmails())  // Store employee emails
                .build();
        p = repo.save(p);
        return toDto(p);
    }

    // Check if the employee is assigned to a project
    // Check if the employee is assigned to a project - FIXED VERSION
    public boolean isEmployeeAssignedToProject(String email) {
        if (email == null || email.trim().isEmpty()) {
            return false;
        }

        String trimmedEmail = email.trim().toLowerCase();

        return repo.findAll().stream()
                .filter(project -> project.getEmployeeEmails() != null) // Null safety
                .anyMatch(project ->
                        project.getEmployeeEmails().stream()
                                .filter(Objects::nonNull) // Filter out null emails
                                .map(String::trim)
                                .map(String::toLowerCase)
                                .anyMatch(employeeEmail -> employeeEmail.equals(trimmedEmail))
                );
    }

    public List<ProjectResponse> findAll() {
        return repo.findAll().stream().map(this::toDto).toList();
    }

    public ProjectResponse findOne(String id) {
        return repo.findById(id).map(this::toDto).orElseThrow();
    }

    public ProjectResponse update(String id, UpdateProjectRequest r) {
        Project p = repo.findById(id).orElseThrow();
        if (r.getName() != null) p.setName(r.getName());
        if (r.getCostCenterCode() != null) p.setCostCenterCode(r.getCostCenterCode());
        if (r.getActive() != null) p.setActive(r.getActive());
        if (r.getManagerId() != null) p.setManagerId(r.getManagerId());
        if (r.getDescription() != null) p.setDescription(r.getDescription());
        if (r.getBudget() != null) p.setBudget(r.getBudget());
        return toDto(repo.save(p));
    }

    public ProjectMappingResponse mapping(String id) {
        Project p = repo.findById(id).orElseThrow();
        return new ProjectMappingResponse(p.getId(), p.getCostCenterCode());
    }

    private ProjectResponse toDto(Project p) {
        return new ProjectResponse(p.getId(), p.getName(), p.getCostCenterCode(), p.getManagerId(), p.isActive(), p.getDescription(), p.getBudget(), p.getEmployeeEmails());
    }

    // Assign employee to project
    public ProjectResponse assignEmployeeToProject(String projectId, String email) {
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("Email cannot be null or empty");
        }

        Project project = repo.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        String trimmedEmail = email.trim().toLowerCase();

        // Check if employee is already assigned
        if (project.getEmployeeEmails() != null &&
                project.getEmployeeEmails().stream()
                        .filter(Objects::nonNull)
                        .map(String::trim)
                        .map(String::toLowerCase)
                        .anyMatch(e -> e.equals(trimmedEmail))) {
            throw new RuntimeException("Employee already assigned to this project");
        }

        // Add employee to project
        project.getEmployeeEmails().add(trimmedEmail);
        Project updatedProject = repo.save(project);

        return toDto(updatedProject);
    }

    // Remove employee from project
    public ProjectResponse removeEmployeeFromProject(String projectId, String email) {
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("Email cannot be null or empty");
        }

        Project project = repo.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        String trimmedEmail = email.trim().toLowerCase();

        // Remove employee from project
        if (project.getEmployeeEmails() != null) {
            project.getEmployeeEmails().removeIf(e ->
                    e != null && e.trim().toLowerCase().equals(trimmedEmail));
        }

        Project updatedProject = repo.save(project);

        return toDto(updatedProject);
    }

}

