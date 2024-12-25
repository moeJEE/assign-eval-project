package com.kachmar.assign_eval.dao.repository;

import com.kachmar.assign_eval.dao.entity.Skill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SkillRepository extends JpaRepository<Skill, Long> {
    long countByIdIn(List<Long> ids);

}
