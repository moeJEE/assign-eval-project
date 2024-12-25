package com.kachmar.assign_eval.mapper;

import com.kachmar.assign_eval.dao.entity.Role;
import com.kachmar.assign_eval.dao.entity.User;
import com.kachmar.assign_eval.dao.enums.user.UserRole;
import com.kachmar.assign_eval.dto.role.RoleRequest;
import com.kachmar.assign_eval.dto.role.RoleResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface RoleMapper {

    @Mapping(target = "userIds", expression = "java(mapUsersToUserIds(role.getUsers()))")
    RoleResponse toResponseDto(Role role);

    @Mapping(target = "users", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "modifiedAt", ignore = true)
    @Mapping(target = "name", expression = "java(stringToUserRole(roleRequest.getName()))")
    Role toEntity(RoleRequest roleRequest);

    default List<Long> mapUsersToUserIds(List<User> users) {
        if (users == null) {
            return null;
        }
        return users.stream()
                .map(User::getId)
                .collect(Collectors.toList());
    }

    default UserRole stringToUserRole(String name) {
        if (name == null) {
            return null;
        }
        return UserRole.valueOf(name);
    }
}