package com.kachmar.assign_eval.dto.project;

import com.kachmar.assign_eval.dao.enums.project.Status;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class ProjectResponse {
    private Long id;
    private String code;
    private String title;
    private String description;
    private Status status;
    private LocalDate startDate;
    private LocalDate endDate;
    private LocalDateTime createdAt;
    private LocalDateTime modifiedAt;
    private List<Long> skillIds;
    private List<Long> developerIds;
    private Long projectManagerId;
    private List<Long> evaluationIds;
}