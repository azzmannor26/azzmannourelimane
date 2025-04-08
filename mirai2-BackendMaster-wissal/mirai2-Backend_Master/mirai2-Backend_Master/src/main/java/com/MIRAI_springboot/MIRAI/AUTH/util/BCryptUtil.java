package com.MIRAI_springboot.MIRAI.AUTH.util;

import org.mindrot.jbcrypt.BCrypt;

public class BCryptUtil {

    // Hash a plain text password
    public static String hashPassword(String plainPassword) {
        return BCrypt.hashpw(plainPassword, BCrypt.gensalt());
    }

    // Verify if the plain password matches the hashed password
    public static boolean verifyPassword(String plainPassword, String hashedPassword) {
        return BCrypt.checkpw(plainPassword, hashedPassword);
    }
}
