package com.finetrack.notification.dto;



import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record InviteManagerRequest(
        @Email @NotBlank String to,
        @NotBlank String firstName,
        @NotBlank String lastName,
        @NotBlank String tempPassword,
        // optional explicit login URL (otherwise use app.mail.loginUrl)
        String loginUrl
) {}

