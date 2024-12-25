package com.kachmar.assign_eval.service;

import com.kachmar.assign_eval.dao.entity.Skill;
import com.kachmar.assign_eval.dao.repository.SkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SkillService {

    private final SkillRepository skillRepository;

    /**
     * Retrieve all skills.
     */
    public List<Skill> getAllSkills() {
        return skillRepository.findAll();
    }

    /**
     * Retrieve a specific skill by ID.
     */
    public Optional<Skill> getSkillById(Long id) {
        return skillRepository.findById(id);
    }

    /**
     * Create a new skill.
     */
    public Skill createSkill(Skill skill) {
        return skillRepository.save(skill);
    }

    /**
     * Update an existing skill.
     */
    public Skill updateSkill(Long id, Skill updatedSkill) {
        return skillRepository.findById(id)
                .map(skill -> {
                    skill.setName(updatedSkill.getName());
                    // Update associated users if provided
                    if (updatedSkill.getUsers() != null) {
                        skill.setUsers(updatedSkill.getUsers());
                    }
                    return skillRepository.save(skill);
                })
                .orElseThrow(() -> new RuntimeException("Skill not found"));
    }

    /**
     * Delete a skill by ID.
     */
    public void deleteSkill(Long id) {
        skillRepository.deleteById(id);
    }
}
