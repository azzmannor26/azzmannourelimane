package com.MIRAI_springboot.MIRAI.AUTH;

import com.MIRAI_springboot.MIRAI.entities.ENUMS.UserRole;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {
    private String token;
    private Long userId;
    private String username;
    private String email;
    private UserRole role;
}
