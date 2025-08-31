package com.finetrack.gateway.controller;

import com.finetrack.gateway.dto.*;
import com.finetrack.gateway.model.Role;
import com.finetrack.gateway.model.User;
import com.finetrack.gateway.service.AuthService;
import com.finetrack.gateway.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(path = "/auth", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
public class AuthController {

    private final UserService users;
    private final AuthService auth;
    private final PasswordEncoder encoder;

    // --- Public ---

    @PostMapping("/register")
    public Mono<Map<String, Object>> register(@Valid @RequestBody RegisterRequest req) {
        return users.registerEmployee(req.email(), req.password(), req.firstName(), req.lastName())
                .map(u -> Map.of(
                        "userId", u.getId(),
                        "email", u.getEmail(),
                        "roles", u.getRoles()
                ));
    }

    @PostMapping("/login")
    public Mono<TokenResponse> login(@Valid @RequestBody LoginRequest req) {
        return users.findByEmail(req.email())
                .switchIfEmpty(Mono.error(new IllegalArgumentException("Bad credentials")))
                .flatMap(u -> encoder.matches(req.password(), u.getPasswordHash())
                        ? auth.issueTokens(u)
                        : Mono.error(new IllegalArgumentException("Bad credentials")));
    }

    @PostMapping("/refresh")
    public Mono<TokenResponse> refresh(@RequestBody Map<String, String> body) {
        String refreshToken = body.get("refresh_token");
        if (refreshToken == null || refreshToken.isBlank()) {
            return Mono.error(new IllegalArgumentException("refresh_token is required"));
        }
        // extract subject with Spring’s decoder already validated earlier if you want,
        // but here we bind refresh token to DB row, and then load user by id in the service
        // For simplicity we re-parse after DB lookup:
        return auth.refresh(refreshToken, null) // will replace null below
                .onErrorResume(e -> Mono.error(e));
    }

    // In practice, we need the User to issue new tokens; add helper:
    @PostMapping("/refresh/by-email")
    public Mono<TokenResponse> refreshByEmail(@RequestBody Map<String, String> body) {
        String refreshToken = body.get("refresh_token");
        String email = body.get("email");
        if (refreshToken == null || email == null) {
            return Mono.error(new IllegalArgumentException("email & refresh_token required"));
        }
        return users.findByEmail(email)
                .switchIfEmpty(Mono.error(new IllegalArgumentException("User not found")))
                .flatMap(u -> auth.refresh(refreshToken, u));
    }

    @GetMapping("/whoami")
    public Mono<WhoAmIResponse> whoAmI(@AuthenticationPrincipal Jwt jwt) {
        if (jwt == null) {
            return Mono.error(new IllegalStateException("Not authenticated"));
        }
        String userId = jwt.getSubject();
        String email = jwt.getClaimAsString("email");
        List<String> roles = jwt.getClaimAsStringList("roles");
        return Mono.just(new WhoAmIResponse(userId, email, roles));
    }

    // --- Authenticated ---

    @PostMapping("/change-password")
    public Mono<Map<String, String>> changePassword(@AuthenticationPrincipal Jwt jwt,
                                                    @RequestBody Map<String, String> body) {
        String oldPw = body.get("oldPassword");
        String newPw = body.get("newPassword");
        if (oldPw == null || newPw == null) return Mono.error(new IllegalArgumentException("oldPassword & newPassword required"));
        return users.findByEmail(jwt.getClaimAsString("email"))
                .flatMap(u -> {
                    if (!encoder.matches(oldPw, u.getPasswordHash())) {
                        return Mono.error(new IllegalArgumentException("Old password incorrect"));
                    }
                    return users.updatePassword(u, newPw).thenReturn(Map.of("status", "ok"));
                });
    }

    // --- Admin ---

    @PostMapping("/admin/invite")
    @PreAuthorize("hasRole('ADMIN')")
    public Mono<Map<String, Object>> invite(@Valid @RequestBody InviteRequest req) {
        Role role = Role.valueOf(req.role().toUpperCase());
        String tempPassword = "ChangeMe_123"; // you can randomize and email it
        return users.createByAdmin(req.email(), req.firstName(), req.lastName(), role, tempPassword)
                .map(u -> Map.of(
                        "userId", u.getId(),
                        "email", u.getEmail(),
                        "role", role.name(),
                        "tempPassword", tempPassword
                ));
    }
}

