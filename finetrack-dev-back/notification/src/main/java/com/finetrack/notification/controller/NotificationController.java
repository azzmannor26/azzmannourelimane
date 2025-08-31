package com.finetrack.notification.controller;

import com.finetrack.notification.dto.InviteManagerRequest;
import com.finetrack.notification.dto.VerifyEmailRequest;
import com.finetrack.notification.service.MailService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notify")
@RequiredArgsConstructor
public class NotificationController {

    private final MailService mail;

    @PostMapping("/verify-email")
    public ResponseEntity<?> sendVerifyEmail(@Valid @RequestBody VerifyEmailRequest req) {
        mail.sendVerifyEmail(req);
        return ResponseEntity.accepted().build();
    }

    @PostMapping("/manager-invite")
    public ResponseEntity<?> sendManagerInvite(@Valid @RequestBody InviteManagerRequest req) {
        mail.sendManagerInvite(req);
        return ResponseEntity.accepted().build();
    }
}

