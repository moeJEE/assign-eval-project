package com.kachmar.assign_eval.dto.skill;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class SkillRequest {

    @NotEmpty(message = "Skill name is mandatory")
    @NotNull(message = "Skill name is mandatory")
    private String skillName;

    @NotEmpty(message = "Skill description is mandatory")
    @NotNull(message = "Skill description is mandatory")
    private String skillDescription;
}
