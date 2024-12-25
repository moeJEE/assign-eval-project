package com.kachmar.assign_eval.dto.evaluation;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class EvaluationRequest {

    @NotNull(message = "Project ID is mandatory")
    private Long projectId;

    @NotNull(message = "Developer ID is mandatory")
    private Long developerId;

    @Positive(message = "Rating must be a positive value")
    private int rating;

    @NotNull(message = "Feedback is mandatory")
    @Size(max = 255, message = "Feedback must be at most 255 characters long")
    private String feedback;
}
