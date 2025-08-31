package com.finetrack.project.config;

import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    @Value("${security.jwt.secret:U6a8oR0J0nJ9C2n2x5Ww7mZ2zKz3bqI8b0x8JwM1m6U=29}")
    private String jwtSecret;

    @Bean
    SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(reg -> reg
                        .requestMatchers(HttpMethod.GET, "/actuator/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/cards/**").hasAnyRole("MANAGER", "ADMIN", "EMPLOYEE")
                        .requestMatchers(HttpMethod.POST, "/api/cards/**").hasAnyRole("MANAGER", "ADMIN")
                        .requestMatchers(HttpMethod.PATCH, "/api/cards/**").hasAnyRole("MANAGER", "ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/cards/**").hasAnyRole("MANAGER", "ADMIN")
                        .anyRequest().authenticated()
                )
                .oauth2ResourceServer(oauth -> oauth
                        .jwt(jwt -> jwt
                                .decoder(jwtDecoder())
                                .jwtAuthenticationConverter(jwtAuthConverter()) // map "roles" -> ROLE_*
                        )
                );
        return http.build();
    }

    @Bean
    public JwtDecoder jwtDecoder() {
        System.out.println("=== CARD SERVICE JWT DECODER DEBUG ===");
        System.out.println("Secret: " + jwtSecret);
        System.out.println("Secret length: " + jwtSecret.length());

        // Use the EXACT same logic as gateway
        byte[] bytes;
        if (jwtSecret.length() >= 32) {
            try {
                // IMPORTANT: Use the same Decoders.BASE64 as gateway
                bytes = Decoders.BASE64.decode(jwtSecret);
                System.out.println("Using base64 decoding");
            } catch (Exception e) {
                System.out.println("Base64 decode failed, using raw bytes: " + e.getMessage());
                bytes = jwtSecret.getBytes(StandardCharsets.UTF_8);
            }
        } else {
            bytes = jwtSecret.getBytes(StandardCharsets.UTF_8);
            System.out.println("Using raw bytes (short secret)");
        }

        System.out.println("Key bytes length: " + bytes.length);
        System.out.println("Key bytes: " + java.util.Arrays.toString(bytes));

        try {
            // Use the EXACT same method as gateway - Keys.hmacShaKeyFor()
            SecretKey key = Keys.hmacShaKeyFor(bytes);
            System.out.println("Key created successfully with algorithm: " + key.getAlgorithm());

            return NimbusJwtDecoder.withSecretKey(key)
                    .macAlgorithm(MacAlgorithm.HS256) // must match Gateway
                    .build();
        } catch (Exception e) {
            System.out.println("Key creation failed: " + e.getMessage());
            throw new RuntimeException("Failed to create JWT decoder", e);
        }
    }

    @Bean
    public JwtAuthenticationConverter jwtAuthConverter() {
        JwtGrantedAuthoritiesConverter gac = new JwtGrantedAuthoritiesConverter();
        gac.setAuthoritiesClaimName("roles"); // your custom claim from Gateway
        gac.setAuthorityPrefix("ROLE_");      // Spring expects ROLE_*

        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(gac);
        return converter;
    }
}