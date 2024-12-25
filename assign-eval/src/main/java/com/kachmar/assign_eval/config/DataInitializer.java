package com.kachmar.assign_eval.config;

import com.kachmar.assign_eval.dao.entity.Role;
import com.kachmar.assign_eval.dao.enums.user.UserRole;
import com.kachmar.assign_eval.dao.repository.RoleRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class DataInitializer {

    private final RoleRepository roleRepository;

    @PostConstruct
    @Transactional
    public void init() {
        createRoleIfNotFound(UserRole.DEVELOPER);
        createRoleIfNotFound(UserRole.PROJECT_MANAGER);
        // Add more roles as needed
    }

    private void createRoleIfNotFound(UserRole roleName) {
        roleRepository.findByName(roleName).orElseGet(() -> {
            Role role = Role.builder()
                    .name(roleName)
                    .build();
            return roleRepository.save(role);
        });
    }
}