package com.kachmar.assign_eval.dao.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.kachmar.assign_eval.dao.enums.user.UserRole;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(
        name = "roles",
        uniqueConstraints = @UniqueConstraint(columnNames = "name", name = "ukofx66keruapi6vyqpv6f2or37")
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Role extends AbstractEntity {

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, unique = true)
    private UserRole name;

    @ManyToMany(mappedBy = "roles")
    @JsonBackReference
    private List<User> users;
}