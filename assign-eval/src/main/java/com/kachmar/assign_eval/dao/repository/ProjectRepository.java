package com.kachmar.assign_eval.dao.repository;

import com.kachmar.assign_eval.dao.entity.Project;
import com.kachmar.assign_eval.dao.entity.User;
import com.kachmar.assign_eval.dao.enums.user.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

    @Query("SELECT p FROM Project p JOIN p.developers d WHERE d = :developer")
    List<Project> findByDevelopers(@Param("developer") User developer);

    @Query("SELECT p FROM Project p JOIN p.developers d WHERE d.id = :developerId")
    List<Project> findByDeveloperId(Long developerId);

}
