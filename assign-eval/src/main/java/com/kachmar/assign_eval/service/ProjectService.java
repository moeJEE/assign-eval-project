package com.kachmar.assign_eval.service;

import com.kachmar.assign_eval.dao.entity.Evaluation;
import com.kachmar.assign_eval.dao.entity.Project;
import com.kachmar.assign_eval.dao.entity.Skill;
import com.kachmar.assign_eval.dao.entity.User;
import com.kachmar.assign_eval.dao.enums.project.Status;
import com.kachmar.assign_eval.dao.enums.user.UserRole;
import com.kachmar.assign_eval.dao.repository.EvaluationRepository;
import com.kachmar.assign_eval.dao.repository.ProjectRepository;
import com.kachmar.assign_eval.dao.repository.SkillRepository;
import com.kachmar.assign_eval.dao.repository.UserRepository;
import com.kachmar.assign_eval.dto.project.ProjectRequest;
import com.kachmar.assign_eval.dto.project.ProjectResponse;
import com.kachmar.assign_eval.exception.ResourceNotFoundException;
import com.kachmar.assign_eval.mapper.ProjectMapper;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final SkillRepository skillRepository;
    private final EvaluationRepository evaluationRepository;
    private final ProjectMapper projectMapper;

    @Transactional
    public ProjectResponse createProject(ProjectRequest projectRequest) {
        Project project = projectMapper.toEntity(projectRequest);

        // Set initial status
        try {
            project.setStatus(Status.valueOf(projectRequest.getStatus().toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid status value: " + projectRequest.getStatus());
        }
        project.setCreatedAt(LocalDateTime.now());
        project.setModifiedAt(LocalDateTime.now());

        // Fetch and set Skills
        List<Skill> skills = skillRepository.findAllById(projectRequest.getSkillIds());
        validateEntityList("Skill", projectRequest.getSkillIds(), skills);
        project.setSkills(skills);

        // Fetch and set Developers
        List<User> developers = userRepository.findAllById(projectRequest.getDeveloperIds());
        validateEntityList("Developer", projectRequest.getDeveloperIds(), developers);
        project.setDevelopers(developers);

        // Fetch and set Project Manager
        User projectManager = userRepository.findById(projectRequest.getProjectManagerId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "projectManagerId", projectRequest.getProjectManagerId()));
        project.setProjectManager(projectManager);

        // Initialize evaluations to prevent null references
        project.setEvaluations(new ArrayList<>());

        // Save project
        Project savedProject = projectRepository.save(project);
        return projectMapper.toResponse(savedProject);
    }

    @Transactional(readOnly = true)
    public ProjectResponse getProjectById(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", projectId));

        // Ensure evaluations are initialized
        if (project.getEvaluations() == null) {
            project.setEvaluations(new ArrayList<>());
        }
        return projectMapper.toResponse(project);
    }

    @Transactional
    public ProjectResponse updateProject(Long projectId, ProjectRequest projectRequest) {
        Project existingProject = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", projectId));

        projectMapper.updateEntityFromDto(projectRequest, existingProject);

        if (projectRequest.getStatus() != null && !projectRequest.getStatus().isEmpty()) {
            try {
                existingProject.setStatus(Status.valueOf(projectRequest.getStatus().toUpperCase()));
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Invalid status value: " + projectRequest.getStatus());
            }
        }
        existingProject.setModifiedAt(LocalDateTime.now());

        if (projectRequest.getSkillIds() != null && !projectRequest.getSkillIds().isEmpty()) {
            List<Skill> skills = skillRepository.findAllById(projectRequest.getSkillIds());
            validateEntityList("Skill", projectRequest.getSkillIds(), skills);
            existingProject.setSkills(skills);
        }

        if (projectRequest.getDeveloperIds() != null && !projectRequest.getDeveloperIds().isEmpty()) {
            List<User> developers = userRepository.findAllById(projectRequest.getDeveloperIds());
            validateEntityList("Developer", projectRequest.getDeveloperIds(), developers);
            existingProject.setDevelopers(developers);
        }

        if (projectRequest.getProjectManagerId() != null) {
            User projectManager = userRepository.findById(projectRequest.getProjectManagerId())
                    .orElseThrow(() -> new ResourceNotFoundException("User", "projectManagerId", projectRequest.getProjectManagerId()));
            existingProject.setProjectManager(projectManager);
        }

        // Ensure evaluations are not null
        if (existingProject.getEvaluations() == null) {
            existingProject.setEvaluations(new ArrayList<>());
        }

        Project updatedProject = projectRepository.save(existingProject);
        return projectMapper.toResponse(updatedProject);
    }

    @Transactional(readOnly = true)
    public List<ProjectResponse> getAllProjects() {
        List<Project> projects = projectRepository.findAll();

        // Ensure evaluations are initialized for all projects
        projects.forEach(project -> {
            if (project.getEvaluations() == null) {
                project.setEvaluations(new ArrayList<>());
            }
        });

        return projects.stream()
                .map(projectMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteProject(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", projectId));
        projectRepository.delete(project);
    }

    /**
     * Validates if the list of IDs matches the retrieved entities.
     */
    private <T> void validateEntityList(String entityName, List<Long> ids, List<T> entities) {
        if (entities.size() != ids.size()) {
            throw new ResourceNotFoundException(entityName, "ids", ids);
        }
    }

    // Method to fetch projects assigned to a specific developer
    // Method to get projects assigned to a specific developer (by developerId)
    public List<Project> getProjectsByDeveloper(Long developerId) {
        // Fetch the list of projects assigned to the developer
        return projectRepository.findByDeveloperId(developerId);
    }

    @Transactional
    public List<ProjectResponse> getProjectsByDeveloperEmail(String developerEmail) {
        Optional<User> userOptional = userRepository.findByEmail(developerEmail);

        if (userOptional.isEmpty()) {
            throw new RuntimeException("Developer not found");
        }

        User developer = userOptional.get();

        // Fetch projects assigned to the developer
        List<Project> projects = projectRepository.findByDevelopers(developer);

        // Map Project entities to ProjectResponse DTOs using ProjectMapper
        return projects.stream()
                .map(projectMapper::toResponse)
                .collect(Collectors.toList());
    }

}
