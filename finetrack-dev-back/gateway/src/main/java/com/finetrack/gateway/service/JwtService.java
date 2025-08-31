package com.finetrack.gateway.service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Service
public class JwtService {

    private final SecretKey key;
    private final String issuer;
    private final Duration accessTtl;
    private final Duration refreshTtl;

    public JwtService(
            @Value("${security.jwt.secret}") String secret,
            @Value("${security.jwt.issuer}") String issuer,
            @Value("${security.jwt.access-ttl}") Duration accessTtl,
            @Value("${security.jwt.refresh-ttl}") Duration refreshTtl
    ) {
        System.out.println("=== JWT SERVICE DEBUG ===");
        System.out.println("Secret: " + secret);
        System.out.println("Secret length: " + secret.length());

        byte[] bytes;
        if (secret.length() >= 32) {
            bytes = Decoders.BASE64.decode(secret);
            System.out.println("Using base64 decoding");
        } else {
            bytes = secret.getBytes();
            System.out.println("Using raw bytes");
        }

        System.out.println("Key bytes length: " + bytes.length);
        System.out.println("Key bytes: " + java.util.Arrays.toString(bytes));

        this.key = Keys.hmacShaKeyFor(bytes);
        this.issuer = issuer;
        this.accessTtl = accessTtl;
        this.refreshTtl = refreshTtl;

        System.out.println("Key algorithm: " + key.getAlgorithm());
    }

    public String createAccessToken(String userId, String email, List<String> roles) {
        Instant now = Instant.now();
        Instant exp = now.plus(accessTtl);
        return Jwts.builder()
                .issuer(issuer)
                .subject(userId)
                .issuedAt(Date.from(now))
                .expiration(Date.from(exp))
                .addClaims(Map.of(
                        "email", email,
                        "roles", roles
                ))
                .signWith(key)
                .compact();
    }

    public String createRefreshToken(String userId) {
        Instant now = Instant.now();
        Instant exp = now.plus(refreshTtl);
        return Jwts.builder()
                .issuer(issuer)
                .subject(userId)
                .issuedAt(Date.from(now))
                .expiration(Date.from(exp))
                .addClaims(Map.of("typ", "refresh"))
                .signWith(key)
                .compact();
    }
}