package com.finetrack.gateway.dto;


import java.util.List;

public record WhoAmIResponse(
        String userId,
        String email,
        List<String> roles
) {}
