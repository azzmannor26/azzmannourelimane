package com.finetrack.project.dto;

import java.util.List;

public record CardResponse(
        String id, String projectId, String last4, String status,
        Long monthlyLimit, Long perTxLimit, List<String> allowedMcc
) {}
