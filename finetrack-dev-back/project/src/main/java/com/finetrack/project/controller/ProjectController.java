package com.finetrack.project.controller;

import com.finetrack.project.dto.*;
import com.finetrack.project.service.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService svc;

    @PostMapping
    @PreAuthorize("hasAnyRole('MANAGER','ADMIN')")
    public ResponseEntity<ProjectResponse> create(@Valid @RequestBody CreateProjectRequest req) {
        var out = svc.create(req);
        return ResponseEntity.created(URI.create("/api/projects/" + out.getId())).body(out); // Use getId() method
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('MANAGER','ADMIN')")
    public List<ProjectResponse> all() { return svc.findAll(); }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('MANAGER','ADMIN')")
    public ProjectResponse one(@PathVariable String id) { return svc.findOne(id); }

    @PatchMapping("/{id}")
    @PreAuthorize("hasAnyRole('MANAGER','ADMIN')")
    public ProjectResponse update(@PathVariable String id, @RequestBody UpdateProjectRequest req) {
        return svc.update(id, req);
    }

    // Check if an employee is assigned to a project
    @GetMapping("/employee/assigned")
    public ResponseEntity<Boolean> isEmployeeAssignedToProject(
            @RequestParam("email") String email) {

        System.out.println("DEBUG: Checking assignment for email: '" + email + "'");

        if (email == null || email.trim().isEmpty()) {
            System.out.println("DEBUG: Email parameter is null or empty");
            return ResponseEntity.badRequest().body(false);
        }

        try {
            boolean isAssigned = svc.isEmployeeAssignedToProject(email);
            System.out.println("DEBUG: Assignment result for '" + email + "': " + isAssigned);
            return ResponseEntity.ok(isAssigned);
        } catch (Exception e) {
            System.out.println("DEBUG: Error checking assignment: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(false);
        }
    }

    // Assign employee to project
    @PostMapping("/{projectId}/employees")
    @PreAuthorize("hasAnyRole('MANAGER','ADMIN')")
    public ResponseEntity<ProjectResponse> assignEmployeeToProject(
            @PathVariable String projectId,
            @RequestBody AssignEmployeeRequest request) {
        try {
            System.out.println("DEBUG: Assigning employee " + request.getEmail() + " to project " + projectId);
            ProjectResponse updatedProject = svc.assignEmployeeToProject(projectId, request.getEmail());
            return ResponseEntity.ok(updatedProject);
        } catch (Exception e) {
            System.out.println("DEBUG: Error assigning employee: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    // Remove employee from project
    @DeleteMapping("/{projectId}/employees/{email}")
    @PreAuthorize("hasAnyRole('MANAGER','ADMIN')")
    public ResponseEntity<ProjectResponse> removeEmployeeFromProject(
            @PathVariable String projectId,
            @PathVariable String email) {
        try {
            System.out.println("DEBUG: Removing employee " + email + " from project " + projectId);
            ProjectResponse updatedProject = svc.removeEmployeeFromProject(projectId, email);
            return ResponseEntity.ok(updatedProject);
        } catch (Exception e) {
            System.out.println("DEBUG: Error removing employee: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    // for Accounting / others
    @GetMapping("/{id}/mapping")
    @PreAuthorize("hasAnyRole('MANAGER','ADMIN','EMPLOYEE')")
    public ProjectMappingResponse mapping(@PathVariable String id) {
        return svc.mapping(id);
    }
}
