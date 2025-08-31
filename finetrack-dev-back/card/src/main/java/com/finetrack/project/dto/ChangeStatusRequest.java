package com.finetrack.project.dto;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record ChangeStatusRequest(
        @NotBlank(message = "Status is required")
        @Pattern(regexp = "ACTIVE|SUSPENDED|LOST", message = "Status must be ACTIVE, SUSPENDED, or LOST")
        String status
) {}
