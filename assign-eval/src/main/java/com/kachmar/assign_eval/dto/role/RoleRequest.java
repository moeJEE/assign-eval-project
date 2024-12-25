package com.kachmar.assign_eval.dto.role;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class RoleRequest {
    @NotEmpty(message = "Role name is required")
    @Pattern(regexp = "PROJECT_MANAGER|DEVELOPER", message = "Role must be either PROJECT_MANAGER, DEVELOPER, or ADMIN")
    private String name;
}