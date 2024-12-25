package com.kachmar.assign_eval.dao.repository;

import com.kachmar.assign_eval.dao.entity.Role;
import com.kachmar.assign_eval.dao.enums.user.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(UserRole name);
}