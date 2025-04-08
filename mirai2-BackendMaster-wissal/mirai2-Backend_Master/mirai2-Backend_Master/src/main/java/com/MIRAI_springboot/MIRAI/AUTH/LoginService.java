package com.MIRAI_springboot.MIRAI.AUTH;

import com.MIRAI_springboot.MIRAI.entities.ENUMS.UserRole;
import com.MIRAI_springboot.MIRAI.entities.User;
import com.MIRAI_springboot.MIRAI.exception.ResourceNotFoundException;
import com.MIRAI_springboot.MIRAI.intern.repository.UserAUTRERepository;
import com.MIRAI_springboot.MIRAI.AUTH.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LoginService {

    private final UserAUTRERepository userRepository;

    public LoginResponse login(String username, String password) {
        // Retrieve the raw data
        List<Object[]> usersRaw = userRepository.findByUsernameAndPasswordRaw(username, password);
        if (usersRaw.isEmpty()) {
            throw new ResourceNotFoundException("Invalid username or password");
        }

        // Map the first result to a User
        User user = mapToUser(usersRaw.get(0));

        // Generate JWT token with user-specific details
        String token = JwtUtil.generateToken(user.getId(), user.getUsername(), user.getRole());

        return new LoginResponse(token, user.getId(), user.getUsername(), user.getEmail(), user.getRole());
    }

    private User mapToUser(Object[] userRaw) {
        User user = new User();
        user.setId(Long.valueOf(userRaw[0].toString())); // Convert Object to Long
        user.setUsername((String) userRaw[1]);
        user.setPassword((String) userRaw[2]);
        user.setEmail((String) userRaw[3]);

        // Convert the role string to UserRole enum
        String roleString = (String) userRaw[4];
        user.setRole(UserRole.valueOf(roleString.toUpperCase())); // Ensure it matches the enum case

        return user;
    }
}
