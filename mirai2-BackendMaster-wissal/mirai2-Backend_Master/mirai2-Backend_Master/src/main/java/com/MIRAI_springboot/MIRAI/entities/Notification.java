package com.MIRAI_springboot.MIRAI.entities;

import com.MIRAI_springboot.MIRAI.entities.ENUMS.NotifStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

@SuperBuilder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "notification")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String contenu;

    private LocalDateTime dateEnvoi;

    @Enumerated(EnumType.STRING)
    private NotifStatus status;  // e.g. "unread", "read"

    // If every notification has exactly ONE destinataire (a user):
    @ManyToOne
    @JoinColumn(name = "users_id", nullable = false)
    private User user;

}
