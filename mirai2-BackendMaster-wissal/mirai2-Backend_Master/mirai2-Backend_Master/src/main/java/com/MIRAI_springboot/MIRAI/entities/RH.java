package com.MIRAI_springboot.MIRAI.entities;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@EqualsAndHashCode(callSuper = true)
@Data
@Getter
@Setter
@SuperBuilder
@Entity
@Table(name = "rh")
@PrimaryKeyJoinColumn(name = "users_id")
public class RH extends User {

    public RH() {

    }
}