package com.finetrack.project.dto;
// com/finetrack/project/dto/UpdateRulesRequest.java

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record UpdateRulesRequest(
        @Min(value = 0, message = "Monthly limit must be non-negative")
        Integer monthlyLimit,

        @Min(value = 0, message = "Per transaction limit must be non-negative")
        Integer perTxLimit,

        List<String> allowedMcc
) {}
