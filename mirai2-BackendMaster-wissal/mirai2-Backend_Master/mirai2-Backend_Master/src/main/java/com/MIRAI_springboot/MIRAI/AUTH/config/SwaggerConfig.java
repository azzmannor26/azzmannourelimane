package com.MIRAI_springboot.MIRAI.AUTH.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Mirai API")
                        .description("Mirai Spring Boot application with Swagger documentation.")
                        .version("1.0.0")
                        // (1) Optional: Add contact info
                        .contact(new Contact()
                                .name("MIRAI GROUP")
                                .email("contact@example.com")
                                .url("https://www.example.com"))
                        // (2) Optional: Add license
                        .license(new License()
                                .name("Apache 2.0")
                                .url("https://www.apache.org/licenses/LICENSE-2.0"))
                        // (3) Optional: Add terms of service
                        .termsOfService("https://www.example.com/terms"));
    }
}
