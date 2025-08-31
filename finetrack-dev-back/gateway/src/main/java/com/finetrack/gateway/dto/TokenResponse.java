package com.finetrack.gateway.dto;


public record TokenResponse(
        String access_token,
        String refresh_token,
        String token_type,
        long expires_in
) {}
