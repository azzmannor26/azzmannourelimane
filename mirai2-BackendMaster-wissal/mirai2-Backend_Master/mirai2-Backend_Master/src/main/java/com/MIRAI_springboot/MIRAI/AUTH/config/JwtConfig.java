package com.MIRAI_springboot.MIRAI.AUTH.config;

import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;

public class JwtConfig {

    // Generate a secure HS256 key
    private static final SecretKey SECRET_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    public static SecretKey getSecretKey() {
        return SECRET_KEY;
    }

    public static String getBase64EncodedSecretKey() {
        return java.util.Base64.getEncoder().encodeToString(SECRET_KEY.getEncoded());
    }
}
