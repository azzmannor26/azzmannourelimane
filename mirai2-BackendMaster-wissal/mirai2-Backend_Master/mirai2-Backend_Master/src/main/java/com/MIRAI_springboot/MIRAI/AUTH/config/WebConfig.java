package com.MIRAI_springboot.MIRAI.AUTH.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Define the absolute path to "uploads/profile-images"
        Path uploadDir = Paths.get("uploads/profile-images");
        String uploadPath = uploadDir.toFile().getAbsolutePath();

        // Serve files via "/profile-images/**"
        registry.addResourceHandler("/profile-images/**")
                .addResourceLocations("file:" + uploadPath + "/");
    }
}
