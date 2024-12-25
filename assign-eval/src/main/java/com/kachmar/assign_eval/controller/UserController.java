package com.kachmar.assign_eval.controller;

import com.kachmar.assign_eval.dao.entity.User;
import com.kachmar.assign_eval.dto.user.UserRequest;
import com.kachmar.assign_eval.dto.user.UserResponse;
import com.kachmar.assign_eval.mapper.UserMapper;
import com.kachmar.assign_eval.service.UserService;
import com.kachmar.assign_eval.dao.enums.user.UserRole; // Import UserRole enum
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.hibernate.annotations.Parameter;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final UserMapper userMapper;

    // Create a new user
    @PostMapping
    public ResponseEntity<UserResponse> createUser(@Valid @RequestBody UserRequest userRequest) {
        User user = userService.createUser(userRequest);
        UserResponse userResponse = userMapper.toResponse(user);
        return ResponseEntity.ok(userResponse);
    }

    // Get user by ID
    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
        User user = userService.getUserById(id);
        UserResponse userResponse = userMapper.toResponse(user);
        return ResponseEntity.ok(userResponse);
    }

    // Update a user
    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> updateUser(@PathVariable Long id, @Valid @RequestBody UserRequest userRequest) {
        User updatedUser = userService.updateUser(id, userRequest);
        UserResponse userResponse = userMapper.toResponse(updatedUser);
        return ResponseEntity.ok(userResponse);
    }

    // Delete a user
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * **Search users by skill IDs .**
     *
     * @param skillIds The list of skill IDs to filter users by.
     * @return A ResponseEntity containing the list of matching users.
     */
    @GetMapping("/searchAll")
    public ResponseEntity<List<UserResponse>> getUsersBySkillIdsWithoutPagination(
            @RequestParam List<Long> skillIds) {
        List<User> users = userService.findUsersBySkillIds(skillIds);
        List<UserResponse> userResponses = userMapper.toResponseList(users);
        return ResponseEntity.ok(userResponses);
    }

    @GetMapping("/project-managers")
    public ResponseEntity<List<UserResponse>> getProjectManagers() {
        List<UserResponse> projectManagers = userService.getUsersByRole(UserRole.PROJECT_MANAGER);
        return ResponseEntity.ok(projectManagers);
    }
    @GetMapping("/developers")
    public ResponseEntity<List<UserResponse>> getDevelopers() {
        List<UserResponse> developers = userService.getUsersByRole(UserRole.DEVELOPER);
        return ResponseEntity.ok(developers);
    }

    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        List<UserResponse> userResponses = userMapper.toResponseList(users);
        return ResponseEntity.ok(userResponses);
    }

    // Get developers by skill IDs
    @GetMapping("/developers-by-skills")
    public ResponseEntity<List<UserResponse>> getDevelopersBySkills(@RequestParam List<Long> skillIds) {
        List<UserResponse> developers = userService.getDevelopersBySkills(skillIds);
        return ResponseEntity.ok(developers);
    }

    @GetMapping("/developerByEmail/{developerEmail}")
    public User getDeveloperByEmail(@PathVariable("developerEmail") String developerEmail) {
        return userService.getDeveloperByEmail(developerEmail);
    }

}
