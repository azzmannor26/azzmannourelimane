package com.MIRAI_springboot.MIRAI.entities;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.ArrayList;
import java.util.List;

@Data
@SuperBuilder
@Entity
@Table(name = "superviseur")
@PrimaryKeyJoinColumn(name = "users_id")
@NoArgsConstructor
@AllArgsConstructor
public class superviseur extends User {
    String poste;
}
