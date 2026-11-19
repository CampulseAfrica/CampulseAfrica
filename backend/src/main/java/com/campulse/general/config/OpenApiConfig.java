package com.campulse.general.config;

import io.swagger.v3.oas.models.ExternalDocumentation;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
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
                        .description("Campulse Documentation"));
    }
}