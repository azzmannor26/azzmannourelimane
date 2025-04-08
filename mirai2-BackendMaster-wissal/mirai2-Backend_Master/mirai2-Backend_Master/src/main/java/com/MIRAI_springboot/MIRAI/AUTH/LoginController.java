package com.MIRAI_springboot.MIRAI.AUTH;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true") // Allow requests from React's dev server
@RequiredArgsConstructor
public class LoginController {

    private final LoginService loginService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @RequestParam String username,
            @RequestParam String password) {
        // Call the login method and return the structured response
        LoginResponse response = loginService.login(username, password);
        return ResponseEntity.ok(response);
    }
}
