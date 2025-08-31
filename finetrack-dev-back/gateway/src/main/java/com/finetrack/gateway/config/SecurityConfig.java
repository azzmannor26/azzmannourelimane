package com.finetrack.gateway.config;

import com.finetrack.gateway.security.RoleConverter;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableReactiveMethodSecurity;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.NimbusReactiveJwtDecoder;
import org.springframework.security.oauth2.jwt.ReactiveJwtDecoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.ReactiveJwtAuthenticationConverterAdapter;
import org.springframework.security.web.server.SecurityWebFilterChain;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;

@Configuration
@EnableWebFluxSecurity
@EnableReactiveMethodSecurity
public class SecurityConfig {

    @Bean
    SecurityWebFilterChain springSecurityFilterChain(
            ServerHttpSecurity http,
            ReactiveJwtAuthenticationConverterAdapter reactiveJwtAuthConverter) {

        return http
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                .authorizeExchange(ex -> ex
                        .pathMatchers(HttpMethod.GET, "/actuator/**").permitAll()
                        .pathMatchers("/auth/register", "/auth/login", "/auth/refresh","/auth/refresh/by-email").permitAll()
                        .pathMatchers("/auth/whoami").authenticated()
                        .pathMatchers("/auth/change-password").authenticated()
                        .pathMatchers("/admin/**").hasRole("ADMIN")
                        .pathMatchers("/api/accounting/**", "/api/exports/**").hasRole("ADMIN")
                        .pathMatchers("/api/approvals/**").hasAnyRole("MANAGER","ADMIN")
                        .pathMatchers(HttpMethod.POST, "/api/projects/**").hasAnyRole("MANAGER","ADMIN")
                        .pathMatchers("/api/cards/**").hasAnyRole("MANAGER","ADMIN")
                        .pathMatchers("/api/projects/**").hasAnyRole("MANAGER","ADMIN","EMPLOYEE")
                        .pathMatchers(HttpMethod.GET, "/api/projects/employee/assigned").permitAll()
                        .pathMatchers("/api/transactions/**").hasAnyRole("EMPLOYEE","MANAGER","ADMIN")
                        .anyExchange().authenticated()
                )
                .oauth2ResourceServer(oauth -> oauth.jwt(jwt -> jwt.jwtAuthenticationConverter(reactiveJwtAuthConverter)))
                .build();
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    ReactiveJwtAuthenticationConverterAdapter reactiveJwtAuthConverter(RoleConverter rolesConverter) {
        var converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(rolesConverter);
        return new ReactiveJwtAuthenticationConverterAdapter(converter);
    }

    @Bean
    ReactiveJwtDecoder jwtDecoder(@Value("${security.jwt.secret}") String secret) {
        System.out.println("=== JWT DECODER DEBUG ===");
        System.out.println("Secret: " + secret);
        System.out.println("Secret length: " + secret.length());

        // Use the EXACT same logic as JwtService
        byte[] bytes;
        if (secret.length() >= 32) {
            try {
                // IMPORTANT: Use the same Decoders.BASE64 as JwtService
                bytes = Decoders.BASE64.decode(secret);
                System.out.println("Using base64 decoding");
            } catch (Exception e) {
                System.out.println("Base64 decode failed, using raw bytes: " + e.getMessage());
                bytes = secret.getBytes(StandardCharsets.UTF_8);
            }
        } else {
            bytes = secret.getBytes(StandardCharsets.UTF_8);
            System.out.println("Using raw bytes (short secret)");
        }

        System.out.println("Key bytes length: " + bytes.length);
        System.out.println("Key bytes: " + java.util.Arrays.toString(bytes));

        try {
            // Use the EXACT same method as JwtService
            SecretKey key = Keys.hmacShaKeyFor(bytes);
            System.out.println("Key created successfully with algorithm: " + key.getAlgorithm());

            return NimbusReactiveJwtDecoder
                    .withSecretKey(key)
                    .macAlgorithm(MacAlgorithm.HS256)
                    .build();
        } catch (Exception e) {
            System.out.println("Key creation failed: " + e.getMessage());
            throw new RuntimeException("Failed to create JWT decoder", e);
        }
    }
}