package com.kachmar.assign_eval.dao.repository;

import com.kachmar.assign_eval.dao.entity.Role;
import com.kachmar.assign_eval.dao.entity.User;
import com.kachmar.assign_eval.dao.enums.user.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    List<User> findDistinctBySkillsIdIn(List<Long> skillIds);

    List<User> findByRoles_Name(UserRole role);

    List<User> findByRoles_NameAndSkills_IdIn(UserRole role, List<Long> skillIds);


}
