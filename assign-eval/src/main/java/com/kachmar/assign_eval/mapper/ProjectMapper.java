package com.kachmar.assign_eval.mapper;

import com.kachmar.assign_eval.dao.entity.Evaluation;
import com.kachmar.assign_eval.dao.entity.Project;
import com.kachmar.assign_eval.dao.entity.Skill;
import com.kachmar.assign_eval.dao.entity.User;
import com.kachmar.assign_eval.dto.project.ProjectRequest;
import com.kachmar.assign_eval.dto.project.ProjectResponse;
import org.mapstruct.*;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface ProjectMapper {

    /**
     * Maps a Project entity to ProjectResponse DTO.
     *
     * @param project The Project entity.
     * @return The ProjectResponse DTO.
     */
    @Mapping(target = "skillIds", source = "skills", qualifiedByName = "skillsToIds")
    @Mapping(target = "developerIds", source = "developers", qualifiedByName = "usersToIds")
    @Mapping(target = "projectManagerId", source = "projectManager", qualifiedByName = "userToId")
    @Mapping(target = "evaluationIds", source = "evaluations", qualifiedByName = "evaluationsToIds")
    ProjectResponse toResponse(Project project);

    /**
     * Maps a ProjectRequest DTO to a Project entity.
     *
     * @param projectRequest The ProjectRequest DTO.
     * @return The Project entity.
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "skills", ignore = true)
    @Mapping(target = "developers", ignore = true)
    @Mapping(target = "projectManager", ignore = true)
    @Mapping(target = "evaluations", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "modifiedAt", ignore = true)
    @Mapping(target = "status", ignore = true)
    Project toEntity(ProjectRequest projectRequest);

    /**
     * Updates an existing Project entity with values from ProjectRequest DTO.
     *
     * @param projectRequest The ProjectRequest DTO.
     * @param project        The existing Project entity.
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "skills", ignore = true)
    @Mapping(target = "developers", ignore = true)
    @Mapping(target = "projectManager", ignore = true)
    @Mapping(target = "evaluations", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "modifiedAt", ignore = true)
    @Mapping(target = "status", ignore = true)
    void updateEntityFromDto(ProjectRequest projectRequest, @MappingTarget Project project);

    /**
     * Converts a list of Skill entities to a list of Skill IDs.
     *
     * @param skills The list of Skill entities.
     * @return The list of Skill IDs.
     */
    @Named("skillsToIds")
    default List<Long> skillsToIds(List<Skill> skills) {
        return skills.stream()
                .map(Skill::getId)
                .collect(Collectors.toList());
    }

    /**
     * Converts a list of User entities to a list of User IDs.
     *
     * @param users The list of User entities.
     * @return The list of User IDs.
     */
    @Named("usersToIds")
    default List<Long> usersToIds(List<User> users) {
        return users.stream()
                .map(User::getId)
                .collect(Collectors.toList());
    }

    /**
     * Converts a User entity to its ID.
     *
     * @param user The User entity.
     * @return The User ID.
     */
    @Named("userToId")
    default Long userToId(User user) {
        return user != null ? user.getId() : null;
    }

    /**
     * Converts a list of Evaluation entities to a list of Evaluation IDs.
     *
     * @param evaluations The list of Evaluation entities.
     * @return The list of Evaluation IDs.
     */
    @Named("evaluationsToIds")
    default List<Long> evaluationsToIds(List<Evaluation> evaluations) {
        return evaluations.stream()
                .map(Evaluation::getId)
                .collect(Collectors.toList());
    }
}