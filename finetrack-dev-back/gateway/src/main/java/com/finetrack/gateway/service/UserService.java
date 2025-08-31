package com.finetrack.gateway.service;


import com.finetrack.gateway.model.Role;
import com.finetrack.gateway.model.User;
import com.finetrack.gateway.repo.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.time.Instant;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository users;
    private final PasswordEncoder encoder;

    public Mono<User> registerEmployee(String email, String rawPassword, String first, String last) {
        return users.findByEmail(email)
                .flatMap(u -> Mono.<User>error(new IllegalStateException("Email already exists")))
                .switchIfEmpty(Mono.defer(() -> {
                    var user = User.builder()
                            .email(email)
                            .passwordHash(encoder.encode(rawPassword))
                            .firstName(first)
                            .lastName(last)
                            .roles(Set.of(Role.EMPLOYEE))
                            .enabled(true)
                            .emailVerified(true) // flip to false if you add email verification flow
                            .createdAt(Instant.now())
                            .updatedAt(Instant.now())
                            .build();
                    return users.save(user);
                }))
                .cast(User.class);
    }

    public Mono<User> createByAdmin(String email, String first, String last, Role role, String tempPassword) {
        return users.findByEmail(email)
                .flatMap(u -> Mono.<User>error(new IllegalStateException("Email already exists")))
                .switchIfEmpty(Mono.defer(() -> {
                    var user = User.builder()
                            .email(email)
                            .passwordHash(encoder.encode(tempPassword))
                            .firstName(first)
                            .lastName(last)
                            .roles(Set.of(role))
                            .enabled(true)
                            .emailVerified(false)
                            .createdAt(Instant.now())
                            .updatedAt(Instant.now())
                            .build();
                    return users.save(user);
                }))
                .cast(User.class);
    }

    public Mono<User> findByEmail(String email) {
        return users.findByEmail(email);
    }

    public Mono<User> updatePassword(User user, String newRawPassword) {
        user.setPasswordHash(encoder.encode(newRawPassword));
        user.setUpdatedAt(Instant.now());
        return users.save(user);
    }
}

