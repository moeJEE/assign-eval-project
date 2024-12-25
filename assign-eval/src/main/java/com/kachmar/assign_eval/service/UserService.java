package com.kachmar.assign_eval.service;

import com.kachmar.assign_eval.dao.entity.Skill;
import com.kachmar.assign_eval.dao.entity.User;
import com.kachmar.assign_eval.dao.entity.Role;
import com.kachmar.assign_eval.dao.enums.user.UserRole;
import com.kachmar.assign_eval.dao.repository.RoleRepository;
import com.kachmar.assign_eval.dao.repository.SkillRepository;
import com.kachmar.assign_eval.dao.repository.UserRepository;
import com.kachmar.assign_eval.dto.user.UserRequest;
import com.kachmar.assign_eval.dto.user.UserResponse;
import com.kachmar.assign_eval.exception.ResourceNotFoundException;
import com.kachmar.assign_eval.mapper.UserMapper;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Service layer for managing users.
 */
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;
    private final SkillRepository skillRepository;


    /**
     * Creates a new user.
     *
     * @param userRequest The user request DTO containing user details.
     * @return The created User entity.
     */
    @Transactional
    public User createUser(UserRequest userRequest) {
        // Check if email already exists
        if (userRepository.findByEmail(userRequest.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email is already in use");
        }

        // Fetch roles by IDs
        List<Role> roles = roleRepository.findAllById(userRequest.getRoleIds());
        if (roles.size() != userRequest.getRoleIds().size()) {
            throw new ResourceNotFoundException("Role", "ids", userRequest.getRoleIds());
        }

        // Fetch skills by IDs
        List<Skill> skills = skillRepository.findAllById(userRequest.getSkills());
        if (skills.size() != userRequest.getSkills().size()) {
            throw new ResourceNotFoundException("Skill", "ids", userRequest.getSkills());
        }

        // Map UserRequest to User entity
        User user = userMapper.toEntity(userRequest);
        user.setPassword(passwordEncoder.encode(userRequest.getPassword()));
        user.setRoles(roles);
        user.setEnabled(true);
        user.setCreatedAt(LocalDateTime.now());
        user.setModifiedAt(LocalDateTime.now());

        for (Skill skill : skills) {
            skill.getUsers().add(user);
        }

        user.setSkills(skills);

        User savedUser = userRepository.save(user);
        for (Skill skill : skills) {
            skillRepository.save(skill);
        }

        return savedUser;
    }


    /**
     * Retrieves a user by their ID.
     *
     * @param id The user's ID.
     * @return The User entity.
     */
    @Transactional(readOnly = true)
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
    }

    /**
     * Updates an existing user.
     *
     * @param id          The ID of the user to update.
     * @param userRequest The user request DTO containing updated details.
     * @return The updated User entity.
     */
    @Transactional
    public User updateUser(Long id, UserRequest userRequest) {
        User existingUser = getUserById(id);

        // Update basic fields
        existingUser.setFirstname(userRequest.getFirstname());
        existingUser.setLastname(userRequest.getLastname());
        existingUser.setEmail(userRequest.getEmail());
        if (userRequest.getPassword() != null && !userRequest.getPassword().isEmpty()) {
            existingUser.setPassword(passwordEncoder.encode(userRequest.getPassword()));
        }

        // Update roles
        List<Role> roles = roleRepository.findAllById(userRequest.getRoleIds());
        existingUser.setRoles(roles);

        // Update skills
        List<Skill> skills = skillRepository.findAllById(userRequest.getSkills());
        existingUser.setSkills(skills);

        // Update availability and portfolio
        existingUser.setAvailable(userRequest.getAvailable());
        existingUser.setPortfolio(userRequest.getPortfolio());

        // Update timestamp
        existingUser.setModifiedAt(LocalDateTime.now());

        return userRepository.save(existingUser);
    }


    /**
     * Deletes a user by their ID.
     *
     * @param id The ID of the user to delete.
     */
    @Transactional
    public void deleteUser(Long id) {
        // Fetch the user to be deleted
        User user = getUserById(id);

        // Remove the user from all associated skills (break the many-to-many relationship)
        for (Skill skill : user.getSkills()) {
            skill.getUsers().remove(user); // Break the relationship without deleting the skill
        }

        // Delete the user from the repository
        userRepository.delete(user);
    }


    /**
     * Finds users by a list of skill IDs.
     *
     * @param skillIds The list of skill IDs to filter users by.
     * @return A list of users matching the specified skill IDs.
     */
    @Transactional(readOnly = true)
    public List<User> findUsersBySkillIds(List<Long> skillIds) {
        if (skillIds == null || skillIds.isEmpty()) {
            throw new IllegalArgumentException("Skill IDs must not be empty");
        }

        // Optional: Validate that all skill IDs exist
        long count = skillRepository.countByIdIn(skillIds);
        if (count != skillIds.size()) {
            throw new ResourceNotFoundException("Skill", "ids", skillIds);
        }

        return userRepository.findDistinctBySkillsIdIn(skillIds);
    }

    @Transactional(readOnly = true)
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<UserResponse> getUsersByRole(UserRole role) {
        List<User> users = userRepository.findByRoles_Name(role);
        if (users == null || users.isEmpty()) {
            throw new ResourceNotFoundException("No users found with role " + role);
        }
        return userMapper.toResponseList(users);
    }
    @Transactional(readOnly = true)
    public List<UserResponse> getDevelopersBySkills(List<Long> skillIds) {
        List<User> developers;

        // If no skills are provided, get all developers with the DEVELOPER role
        if (skillIds == null || skillIds.isEmpty()) {
            developers = userRepository.findByRoles_Name(UserRole.DEVELOPER);
        } else {
            // If skills are provided, filter developers by role and skills
            developers = userRepository.findByRoles_NameAndSkills_IdIn(UserRole.DEVELOPER, skillIds);
        }

        // Map the entities to DTOs
        return userMapper.toResponseList(developers);
    }


    @Transactional
    public User getDeveloperByEmail(String developerEmail) {
        // Fetch the user by their email
        Optional<User> userOptional = userRepository.findByEmail(developerEmail);

        if (userOptional.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        User developer = userOptional.get();

        // Check if the user has the 'DEVELOPER' role
        boolean isDeveloper = developer.getRoles().stream()
                .anyMatch(role -> role.getName() == UserRole.DEVELOPER);

        if (!isDeveloper) {
            throw new RuntimeException("User is not a developer");
        }

        // Return the developer's details
        return developer;
    }






}
