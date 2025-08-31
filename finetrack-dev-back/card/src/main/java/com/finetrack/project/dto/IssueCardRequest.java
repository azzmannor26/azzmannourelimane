package com.finetrack.project.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record IssueCardRequest(
        @NotBlank String projectId,
        @NotNull Long monthlyLimit,
        @NotNull Long perTxLimit,
        List<String> allowedMcc
) {}