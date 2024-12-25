package com.kachmar.assign_eval.dto.user;

import com.kachmar.assign_eval.dto.skill.SkillResponse;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class UserResponse {
    private Long id;
    private String firstname;
    private String lastname;
    private String email;
    private Boolean accountLocked;
    private Boolean enabled;
    private LocalDate dateOfBirth;
    private String portfolio;
    private Boolean available;
    private Integer teamSize;
    private List<Long> roleIds;
    private LocalDateTime createdAt;
    private LocalDateTime modifiedAt;
    private List<SkillResponse> skills;
    private List<String> roleNames;
}
