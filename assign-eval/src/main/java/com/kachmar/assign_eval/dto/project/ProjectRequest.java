package com.kachmar.assign_eval.dto.project;

import com.kachmar.assign_eval.dao.enums.project.Status;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class ProjectRequest {

    @NotEmpty(message = "Project code is required")
    private String code;

    @NotEmpty(message = "Project title is required")
    private String title;

    private String description;

    @NotNull(message = "Status is required")
    private String status;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    @NotNull(message = "End date is required")
    private LocalDate endDate;

    @NotEmpty(message = "At least one skill ID is required")
    private List<Long> skillIds;

    @NotEmpty(message = "At least one developer ID is required")
    private List<Long> developerIds;

    @NotNull(message = "Project Manager ID is required")
    private Long projectManagerId;
}