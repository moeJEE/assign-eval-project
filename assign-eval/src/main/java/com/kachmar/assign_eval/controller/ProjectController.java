package com.kachmar.assign_eval.controller;

import com.kachmar.assign_eval.dao.entity.Project;
import com.kachmar.assign_eval.dto.project.ProjectRequest;
import com.kachmar.assign_eval.dto.project.ProjectResponse;
import com.kachmar.assign_eval.service.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService; // Injected via constructor

    // Get all projects
    @GetMapping
    public ResponseEntity<List<ProjectResponse>> getAllProjects() {
        List<ProjectResponse> projects = projectService.getAllProjects();
        return ResponseEntity.ok(projects);
    }

    // Get a project by ID
    @GetMapping("/{id}")
    public ResponseEntity<ProjectResponse> getProjectById(@PathVariable Long id) {
        ProjectResponse project = projectService.getProjectById(id);
        return ResponseEntity.ok(project);
    }

    // Create a new project
    @PostMapping
    public ResponseEntity<ProjectResponse> createProject(@Valid @RequestBody ProjectRequest projectRequest) {
        ProjectResponse createdProject = projectService.createProject(projectRequest);
        return ResponseEntity.ok(createdProject);
    }

    // Update an existing project
    @PutMapping("/{id}")
    public ResponseEntity<ProjectResponse> updateProject(@PathVariable Long id, @Valid @RequestBody ProjectRequest projectRequest) {
        ProjectResponse updatedProject = projectService.updateProject(id, projectRequest);
        return ResponseEntity.ok(updatedProject);
    }

    // Delete a project
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/assignedTo/{developerEmail}")
    public ResponseEntity<List<ProjectResponse>> getProjectsByDeveloper(
            @PathVariable("developerEmail") String developerEmail) {
        List<ProjectResponse> projectResponses = projectService.getProjectsByDeveloperEmail(developerEmail);
        return ResponseEntity.ok(projectResponses);
    }


}
