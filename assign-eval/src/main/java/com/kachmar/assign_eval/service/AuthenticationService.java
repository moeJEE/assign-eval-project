package com.kachmar.assign_eval.service;

import com.kachmar.assign_eval.dto.auth.AuthenticationRequest;
import com.kachmar.assign_eval.dto.auth.AuthenticationResponse;
import com.kachmar.assign_eval.dto.auth.RegistrationRequest;
import com.kachmar.assign_eval.dao.entity.Role;
import com.kachmar.assign_eval.dao.entity.Token;
import com.kachmar.assign_eval.dao.entity.User;
import com.kachmar.assign_eval.dao.enums.email.EmailTemplateName;
import com.kachmar.assign_eval.dao.enums.user.UserRole;
import com.kachmar.assign_eval.dao.repository.RoleRepository;
import com.kachmar.assign_eval.dao.repository.TokenRepository;
import com.kachmar.assign_eval.dao.repository.UserRepository;
import com.kachmar.assign_eval.dao.service.EmailService;
import com.kachmar.assign_eval.security.JwtService;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final RoleRepository roleRepository;
    private final EmailService emailService;
    private final TokenRepository tokenRepository;

    @Value("${application.mailing.frontend.activation-url:http://localhost:4200/activate-account}")
    private String activationUrl;

    public AuthenticationResponse register(RegistrationRequest request) throws MessagingException {
        // Validate and retrieve the specified role from the database
        String roleInput = request.getRole().toUpperCase();
        UserRole roleName;
        try {
            roleName = UserRole.valueOf(roleInput);
        } catch (IllegalArgumentException e) {
            throw new IllegalStateException("ROLE " + roleInput + " is invalid");
        }

        Role specifiedRole = roleRepository.findByName(roleName)
                .orElseThrow(() -> new IllegalStateException("ROLE " + roleName + " was not initiated"));

        // Create User entity with the specified role
        User user = User.builder()
                .firstname(request.getFirstname())
                .lastname(request.getLastname())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .accountLocked(false)
                .enabled(false)
                .roles(List.of(specifiedRole))
                .build();

        // Save the user before sending validation email to ensure user has an ID
        User savedUser = userRepository.save(user);

        // Generate JWT token for the saved user
        var claims = new HashMap<String, Object>();
        claims.put("fullName", savedUser.getFullName());
        String jwtToken = jwtService.generateToken(claims, savedUser);

        // Optionally, send the validation email here
        sendValidationEmail(savedUser);

        // Return the AuthenticationResponse with the token
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }


    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        var auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        var claims = new HashMap<String, Object>();
        var user = ((User) auth.getPrincipal());
        claims.put("fullName", user.getFullName());

        var jwtToken = jwtService.generateToken(claims, user);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }

    @Transactional
    public String activateAccount(String token) throws MessagingException {
        Token savedToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid token"));

        if (LocalDateTime.now().isAfter(savedToken.getExpiresAt())) {
            sendValidationEmail(savedToken.getUser());
            throw new RuntimeException("Activation token has expired. A new token has been sent to the same email address");
        }

        // Find the associated user
        var user = userRepository.findById(savedToken.getUser().getId())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // Enable the user
        user.setEnabled(true);
        userRepository.save(user);

        // Mark the token as validated
        savedToken.setValidatedAt(LocalDateTime.now());
        tokenRepository.save(savedToken);

        // Return the user's role (assuming a single role for simplicity)
        return user.getRoles().stream()
                .findFirst()
                .map(role -> role.getName().name()) // Assuming role name is an enum
                .orElseThrow(() -> new RuntimeException("User does not have an assigned role"));
    }




    private String generateAndSaveActivationToken(User user) {
        String generatedToken = generateActivationCode(6);
        var token = Token.builder()
                .token(generatedToken)
                .createdAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusMinutes(15))
                .user(user)
                .build();
        tokenRepository.save(token);

        return generatedToken;
    }

    private void sendValidationEmail(User user) throws MessagingException {
        var newToken = generateAndSaveActivationToken(user);

        emailService.sendEmail(
                user.getEmail(),
                user.getFullName(),
                EmailTemplateName.ACTIVATE_ACCOUNT,
                activationUrl,
                newToken,
                "Account activation"
        );
    }

    private String generateActivationCode(int length) {
        String characters = "0123456789";
        StringBuilder codeBuilder = new StringBuilder();
        SecureRandom secureRandom = new SecureRandom();

        for (int i = 0; i < length; i++) {
            int randomIndex = secureRandom.nextInt(characters.length());
            codeBuilder.append(characters.charAt(randomIndex));
        }

        return codeBuilder.toString();
    }
}
