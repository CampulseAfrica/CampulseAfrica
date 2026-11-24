package com.campulse.general.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.ExternalDocumentation;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI campulseOpenAPI() {

        return new OpenAPI()
                .info(new Info()
                        .title("Campulse API")
                        .description("Backend API for Campulse - A social platform for Nigerian university students.")
                        .version("v1.0.0")
                        .contact(new Contact()
                                .name("Campulse Team")
                                .email("support@campulse.com")
                        ))
                .externalDocs(new ExternalDocumentation()
                        .description("Campulse Documentation"))

                // Define JWT authentication
                .components(new Components()
                        .addSecuritySchemes("bearerAuth",
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                        ))

                // Apply JWT authentication to API endpoints
                .addSecurityItem(new SecurityRequirement()
                        .addList("bearerAuth"));
    }
}