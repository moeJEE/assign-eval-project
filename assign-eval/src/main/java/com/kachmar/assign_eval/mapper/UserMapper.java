package com.kachmar.assign_eval.mapper;

import com.kachmar.assign_eval.dao.entity.Role;
import com.kachmar.assign_eval.dao.entity.Skill;
import com.kachmar.assign_eval.dao.entity.User;
import com.kachmar.assign_eval.dao.enums.user.UserRole;
import com.kachmar.assign_eval.dto.skill.SkillResponse;
import com.kachmar.assign_eval.dto.user.UserRequest;
import com.kachmar.assign_eval.dto.user.UserResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface UserMapper {

    /**
     * Maps a User entity to UserResponse DTO.
     */
    @Mapping(target = "roleIds", source = "roles", qualifiedByName = "rolesToIds")
    @Mapping(target = "roleNames", expression = "java(rolesToNames(user.getRoles()))")
    @Mapping(target = "skills", expression = "java(mapSkills(user.getSkills()))")
    @Mapping(target = "portfolio", source = "portfolio")
    @Mapping(target = "available", source = "available")
    UserResponse toResponse(User user);
    List<UserResponse> toResponseList(List<User> users);

    @Mapping(target = "roles", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "modifiedAt", ignore = true)
    @Mapping(target = "accountLocked", ignore = true)
    @Mapping(target = "enabled", ignore = true)
    @Mapping(target = "dateOfBirth", source = "dateOfBirth")
    @Mapping(target = "portfolio", source = "portfolio")
    @Mapping(target = "available", source = "available")
    @Mapping(target = "teamSize", source = "teamSize")
    @Mapping(target = "skills", ignore = true)
    User toEntity(UserRequest userRequest);

    @Named("rolesToIds")
    default List<Long> rolesToIds(List<Role> roles) {
        if (roles == null) {
            return null;
        }
        return roles.stream()
                .map(Role::getId)
                .collect(Collectors.toList());
    }

    /**
     * Converts a list of Role entities to a list of role names.
     * Now properly handles the UserRole enum conversion.
     */
    default List<String> rolesToNames(List<Role> roles) {
        if (roles == null) {
            return null;
        }
        return roles.stream()
                .map(role -> role.getName().toString())
                .collect(Collectors.toList());
    }

    default List<SkillResponse> mapSkills(List<Skill> skills) {
        if (skills == null) {
            return null;
        }
        return skills.stream()
                .map(this::skillToSkillResponse)
                .collect(Collectors.toList());
    }

    default SkillResponse skillToSkillResponse(Skill skill) {
        if (skill == null) {
            return null;
        }
        return SkillResponse.builder()
                .skillId(skill.getId())
                .skillName(skill.getName())
                .build();
    }
}