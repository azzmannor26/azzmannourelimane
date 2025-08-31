package com.finetrack.gateway.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.Set;

@Document("users")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class User {
    @Id
    private String id;

    @Indexed(unique = true)
    private String email;

    private String passwordHash;

    private String firstName;
    private String lastName;

    private Set<Role> roles;

    private boolean enabled;
    private boolean emailVerified;

    private Instant createdAt;
    private Instant updatedAt;
}
