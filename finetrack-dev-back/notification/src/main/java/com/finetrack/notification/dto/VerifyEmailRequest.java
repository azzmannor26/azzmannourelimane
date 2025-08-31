package com.finetrack.notification.dto;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record VerifyEmailRequest(
        @Email @NotBlank String to,
        @NotBlank String fullName,
        // Either pass a complete link, or we will build it from token + base URL
        String verificationLink,
        String token
) {}

