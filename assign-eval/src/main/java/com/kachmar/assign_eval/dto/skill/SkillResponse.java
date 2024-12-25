package com.kachmar.assign_eval.dto.skill;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class SkillResponse {
    private Long skillId;
    private String skillName;
    private String skillDescription;
}
