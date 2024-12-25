package com.kachmar.assign_eval.dto.evaluation;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class EvaluationResponse {
    private Long evaluationId;
    private Long projectId;
    private Long developerId;
    private String developerName;
    private Long projectManagerId;
    private String projectManagerName;
    private int rating;
    private String feedback;
    private String createdAt;
}
