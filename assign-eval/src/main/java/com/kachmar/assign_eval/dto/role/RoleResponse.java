package com.kachmar.assign_eval.dto.role;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class RoleResponse {
    private Long id;
    private String name;
    private List<Long> userIds;
}