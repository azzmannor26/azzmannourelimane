package com.finetrack.notification.service;


import com.finetrack.notification.dto.InviteManagerRequest;
import com.finetrack.notification.dto.VerifyEmailRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import jakarta.mail.internet.MimeMessage;

@Service
@RequiredArgsConstructor
public class MailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    @Value("${app.mail.from:no-reply@localhost}")
    private String from;

    @Value("${app.mail.frontendBaseUrl:http://localhost:3000}")
    private String frontendBase;

    @Value("${app.mail.loginUrl:http://localhost:3000/login}")
    private String defaultLoginUrl;

    public void sendVerifyEmail(VerifyEmailRequest req) {
        String link = req.verificationLink();
        if (link == null || link.isBlank()) {
            // Build a default link if only a token is provided
            link = frontendBase + "/verify-email?token=" + req.token();
        }

        Context ctx = new Context();
        ctx.setVariable("fullName", req.fullName());
        ctx.setVariable("verificationLink", link);

        String html = templateEngine.process("verify-email", ctx);
        sendHtml(req.to(), "Vérifiez votre email", html);
    }

    public void sendManagerInvite(InviteManagerRequest req) {
        String loginUrl = (req.loginUrl() == null || req.loginUrl().isBlank())
                ? defaultLoginUrl
                : req.loginUrl();

        Context ctx = new Context();
        ctx.setVariable("firstName", req.firstName());
        ctx.setVariable("lastName", req.lastName());
        ctx.setVariable("tempPassword", req.tempPassword());
        ctx.setVariable("loginUrl", loginUrl);

        String html = templateEngine.process("manager-invite", ctx);
        sendHtml(req.to(), "Invitation Manager – Accès à FINETRACK", html);
    }

    private void sendHtml(String to, String subject, String htmlBody) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, "UTF-8");
            helper.setFrom(from); // resolves to MAIL_FROM or SMTP_USER
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);
            mailSender.send(message);
        } catch (Exception e) {
            // add the root cause message for easier debugging
            throw new RuntimeException("Failed to send email to " + to + ": " + e.getMessage(), e);
        }
    }

}

