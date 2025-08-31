package com.finetrack.project.domain;


import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@Document("cards")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Card {
    @Id
    private String id;

    private String projectId;

    private String last4;

    @Builder.Default
    private String status = "ACTIVE"; // ACTIVE | SUSPENDED

    private CardRules rules;

    @Builder.Default
    private Instant createdAt = Instant.now();
}

