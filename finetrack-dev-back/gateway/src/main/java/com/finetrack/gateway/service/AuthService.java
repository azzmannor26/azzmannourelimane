package com.finetrack.gateway.service;

import com.finetrack.gateway.dto.TokenResponse;
import com.finetrack.gateway.model.RefreshToken;
import com.finetrack.gateway.model.User;
import com.finetrack.gateway.repo.RefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final JwtService jwt;
    private final RefreshTokenRepository refreshTokens;

    public Mono<TokenResponse> issueTokens(User user) {
        System.out.println("=== ISSUING TOKENS DEBUG ===");
        System.out.println("User ID: " + user.getId());
        System.out.println("User roles: " + user.getRoles());
        System.out.println("User roles type: " + (user.getRoles() != null ? user.getRoles().iterator().next().getClass() : "null"));

        var roles = user.getRoles().stream().map(Enum::name).toList();
        System.out.println("Converted roles for JWT: " + roles);

        var access = jwt.createAccessToken(user.getId(), user.getEmail(), roles);
        var refresh = jwt.createRefreshToken(user.getId());

        var rt = RefreshToken.builder()
                .userId(user.getId())
                .token(refresh)
                .expiresAt(Instant.now().plusSeconds(30 * 60)) // Keep aligned with refresh-ttl (30m)
                .revoked(false)
                .build();

        return refreshTokens.save(rt)
                .map(saved -> new TokenResponse(access, saved.getToken(), "Bearer", 300));
    }

    public Mono<TokenResponse> refresh(String refreshToken, User user) {
        return refreshTokens.findByToken(refreshToken)
                .switchIfEmpty(Mono.error(new IllegalStateException("Invalid refresh token")))
                .flatMap(rt -> {
                    if (rt.isRevoked() || rt.getExpiresAt().isBefore(Instant.now())) {
                        return Mono.error(new IllegalStateException("Refresh token expired or revoked"));
                    }
                    // rotate: revoke old token
                    rt.setRevoked(true);
                    return refreshTokens.save(rt);
                })
                .then(issueTokens(user));
    }

    public Mono<Void> revokeAllForUser(String userId) {
        // Optional: implement bulk revoke if needed
        return Mono.empty();
    }
}

