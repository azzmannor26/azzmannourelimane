package com.MIRAI_springboot.MIRAI.AUTH.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import com.MIRAI_springboot.MIRAI.AUTH.config.JwtConfig;
import com.MIRAI_springboot.MIRAI.entities.ENUMS.UserRole;

import java.util.Date;
import java.util.concurrent.ConcurrentHashMap;

public class JwtUtil {

    private static final long EXPIRATION_TIME = 86400000; // 1 day in milliseconds
    private static final ConcurrentHashMap<String, Boolean> tokenBlacklist = new ConcurrentHashMap<>();

    public static String generateToken(Long userId, String username, UserRole role) {
        return Jwts.builder()
                .claim("userId", userId)
                .claim("username", username)
                .claim("role", role.toString())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(JwtConfig.getSecretKey())
                .compact();
    }

    public static boolean validateToken(String token) {
        if (isTokenBlacklisted(token)) {
            return false;
        }
        try {
            Jwts.parserBuilder()
                    .setSigningKey(JwtConfig.getSecretKey())
                    .build()
                    .parseClaimsJws(token);
            return true; // If parsing succeeds, token is valid
        } catch (Exception e) {
            return false; // Any exception means the token is invalid
        }
    }

    public static Claims extractClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(JwtConfig.getSecretKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public static void blacklistToken(String token) {
        tokenBlacklist.put(token, true);
    }

    public static boolean isTokenBlacklisted(String token) {
        return tokenBlacklist.getOrDefault(token, false);
    }
}
