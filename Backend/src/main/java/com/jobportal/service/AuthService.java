package com.jobportal.service;

import com.google.firebase.auth.FirebaseAuth;
import com.jobportal.dto.request.RegisterRequest;
import com.jobportal.entity.UserEntity;
import com.jobportal.entity.UserRole;
import com.jobportal.repository.ActivityLogRepository;
import com.jobportal.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final ActivityLogRepository activityLogRepository;

    public AuthService(UserRepository userRepository, ActivityLogRepository activityLogRepository) {
        this.userRepository = userRepository;
        this.activityLogRepository = activityLogRepository;
    }

    public UserEntity registerUser(String uid, RegisterRequest request) throws Exception {
        UserEntity existing = userRepository.findById(uid);
        if (existing != null) {
            throw new RuntimeException("User already exists");
        }

        String assignedRole = request.getRole();
        String verificationStatus = "APPROVED";

        if ("ROLE_RECRUITER".equalsIgnoreCase(assignedRole)) {
            assignedRole = UserRole.ROLE_PENDING_RECRUITER.name();
            verificationStatus = "PENDING";
        } else {
            assignedRole = UserRole.ROLE_JOB_SEEKER.name();
        }

        UserEntity newUser = UserEntity.builder()
                .uid(uid)
                .email(request.getEmail())
                .fullName(request.getFullName())
                .role(assignedRole)
                .verificationStatus(verificationStatus)
                .profileCompleted(true) // Set to true after registration payload
                .isActive(true)
                .createdAt(Instant.now().toString())
                .lastLogin(Instant.now().toString())
                .provider(request.getProvider())
                .build();

        // 1. Save to Firestore First
        userRepository.save(newUser);

        // 2. Set Custom Claims in Firebase Auth (The Source of Truth for Security)
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", assignedRole);
        FirebaseAuth.getInstance().setCustomUserClaims(uid, claims);

        activityLogRepository.logActivity(uid, "REGISTER");

        return newUser;
    }

    public UserEntity loginUser(String uid) throws ExecutionException, InterruptedException {
        UserEntity user = userRepository.findById(uid);
        if (user == null) {
            throw new RuntimeException("User profile not found. Please register.");
        }
        
        user.setLastLogin(Instant.now().toString());
        userRepository.save(user);
        
        activityLogRepository.logActivity(uid, "LOGIN");
        return user;
    }
    
    public UserEntity handleGoogleSignIn(String uid, RegisterRequest request) throws Exception {
        UserEntity user = userRepository.findById(uid);
        if (user == null) {
            request.setProvider("GOOGLE");
            return registerUser(uid, request);
        } else {
            user.setLastLogin(Instant.now().toString());
            userRepository.save(user);
            activityLogRepository.logActivity(uid, "GOOGLE_LOGIN");
            return user;
        }
    }
}
