package com.jobportal.service;

import com.jobportal.dto.request.RegisterRequest;
import com.jobportal.entity.UserEntity;
import com.jobportal.entity.UserRole;
import com.jobportal.repository.ActivityLogRepository;
import com.jobportal.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutionException;
import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final ActivityLogRepository activityLogRepository;
    private final PasswordEncoder passwordEncoder;
    private final NotificationService notificationService;

    public AuthService(UserRepository userRepository, ActivityLogRepository activityLogRepository, PasswordEncoder passwordEncoder, NotificationService notificationService) {
        this.userRepository = userRepository;
        this.activityLogRepository = activityLogRepository;
        this.passwordEncoder = passwordEncoder;
        this.notificationService = notificationService;
    }

    public UserEntity registerUser(String uid, RegisterRequest request) throws Exception {
        UserEntity existing = userRepository.findByEmail(request.getEmail()).orElse(null);
        if (existing != null) {
            throw new RuntimeException("User already exists with this email");
        }

        String assignedRole = request.getRole();
        String verificationStatus = "APPROVED";

        if ("ROLE_RECRUITER".equalsIgnoreCase(assignedRole)) {
            assignedRole = UserRole.ROLE_RECRUITER.name();
            verificationStatus = "APPROVED";
        } else {
            assignedRole = UserRole.ROLE_JOB_SEEKER.name();
        }

        UserEntity newUser = UserEntity.builder()
                .uid(uid)
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .role(assignedRole)
                .verificationStatus(verificationStatus)
                .profileCompleted(true) // Set to true after registration payload
                .isActive(true)
                .createdAt(Instant.now().toString())
                .lastLogin(Instant.now().toString())
                .provider(request.getProvider())
                .build();

        userRepository.save(newUser);

        // activityLogRepository.logActivity(uid, "REGISTER"); // TODO: Fix logActivity in JPA

        notificationService.sendNotification(
                uid,
                "REGISTRATION_SUCCESS",
                "Welcome to JobPortal!",
                "Your account has been created successfully. Build your profile to get started.",
                "/dashboard",
                request.getEmail()
        );

        return newUser;
    }

    public UserEntity loginUser(String uid) throws ExecutionException, InterruptedException {
        UserEntity user = userRepository.findById(uid).orElse(null);
        if (user == null) {
            throw new RuntimeException("User profile not found. Please register.");
        }
        
        user.setLastLogin(Instant.now().toString());
        userRepository.save(user);
        
        // activityLogRepository.logActivity(uid, "LOGIN");
        return user;
    }
    
    public UserEntity handleGoogleSignIn(String uid, RegisterRequest request) throws Exception {
        UserEntity user = userRepository.findById(uid).orElse(null);
        if (user == null) {
            request.setProvider("GOOGLE");
            return registerUser(uid, request);
        } else {
            user.setLastLogin(Instant.now().toString());
            userRepository.save(user);
            // activityLogRepository.logActivity(uid, "GOOGLE_LOGIN");
            return user;
        }
    }
}
