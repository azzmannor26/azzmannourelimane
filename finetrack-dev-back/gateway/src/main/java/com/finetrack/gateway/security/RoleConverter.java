package com.finetrack.gateway.security;

import org.springframework.core.convert.converter.Converter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class RoleConverter implements Converter<Jwt, Collection<GrantedAuthority>> {

    @Override
    public Collection<GrantedAuthority> convert(Jwt jwt) {
        try {
            System.out.println("=== ROLE CONVERSION DEBUG ===");
            System.out.println("JWT Subject: " + jwt.getSubject());

            // Extract roles claim
            List<String> roles = jwt.getClaim("roles");
            System.out.println("Raw roles from JWT: " + roles);
            System.out.println("Roles type: " + (roles != null && !roles.isEmpty() ? roles.get(0).getClass() : "null"));

            if (roles == null || roles.isEmpty()) {
                System.out.println("No roles found in JWT");
                return Set.of();
            }

            Collection<GrantedAuthority> authorities = roles.stream()
                    .map(role -> {
                        String authority = "ROLE_" + role.toUpperCase();
                        System.out.println("Converting: '" + role + "' -> '" + authority + "'");
                        return new SimpleGrantedAuthority(authority);
                    })
                    .collect(Collectors.toSet());

            System.out.println("Final authorities: " + authorities);
            return authorities;

        } catch (Exception e) {
            System.out.println("Error in RoleConverter: " + e.getMessage());
            e.printStackTrace();
            return Set.of();
        }
    }
}