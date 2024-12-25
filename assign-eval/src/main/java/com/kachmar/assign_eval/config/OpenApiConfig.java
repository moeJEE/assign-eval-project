package com.kachmar.assign_eval.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.servers.Server;
import io.swagger.v3.oas.annotations.tags.Tag;

@OpenAPIDefinition(
        info = @Info(
                title = "OpenApi Specification - Kachmar",
                version = "1.0",
                description = "OpenApi documentation for JWT-based security",
                termsOfService = "Terms of service",
                contact = @Contact(
                        name = "Kachmar",
                        url = "https://kachmar.ma/",
                        email = "contact@kachmar.ma"
                ),
                license = @License(
                        name = "License Name",
                        url = "https://some-url.com"
                )
        ),
        servers = {
                @Server(
                        description = "Local Environment",
                        url = "http://localhost:8088/api/v1"
                ),
                @Server(
                        description = "Production Environment",
                        url = "https://kachmar.ma/"
                )
        },
        security = @SecurityRequirement(name = "bearerAuth"),
        tags = {
                @Tag(name = "Authentication", description = "Authentication operations (login, registration, account activation)"),
                @Tag(name = "user-controller", description = "User management operations"),
                @Tag(name = "role-controller", description = "Role management operations"),
                @Tag(name = "project-controller", description = "Project management operations"),
                @Tag(name = "skill-controller", description = "Skill management operations"),
                @Tag(name = "evaluation-controller", description = "Evaluation management operations")
        }
)
@SecurityScheme(
        name = "bearerAuth",
        description = "JWT Bearer token authentication",
        type = SecuritySchemeType.HTTP,
        scheme = "bearer",
        bearerFormat = "JWT"
)
public class OpenApiConfig {
}
