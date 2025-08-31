package com.finetrack.project.dto;

import java.util.List;

public record RulesResponse(
        String cardId, Long monthlyLimit, Long perTxLimit, List<String> allowedMcc
) {}