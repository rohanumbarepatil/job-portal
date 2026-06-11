package com.jobportal.controller;

import com.jobportal.dto.request.RegisterRequest;
import com.jobportal.entity.UserEntity;
import com.jobportal.response.GlobalResponse;
import com.jobportal.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<GlobalResponse<UserEntity>> register(@Valid @RequestBody RegisterRequest request) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String uid = auth.getName();
            UserEntity user = authService.registerUser(uid, request);
            return ResponseEntity.ok(GlobalResponse.success("Registration successful", user));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(GlobalResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<GlobalResponse<UserEntity>> login() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String uid = auth.getName();
            UserEntity user = authService.loginUser(uid);
            return ResponseEntity.ok(GlobalResponse.success("Login successful", user));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(GlobalResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/google")
    public ResponseEntity<GlobalResponse<UserEntity>> googleSignIn(@Valid @RequestBody RegisterRequest request) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String uid = auth.getName();
            UserEntity user = authService.handleGoogleSignIn(uid, request);
            return ResponseEntity.ok(GlobalResponse.success("Google Sign-In successful", user));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(GlobalResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<GlobalResponse<String>> logout() {
        return ResponseEntity.ok(GlobalResponse.success("Logout successful", null));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<GlobalResponse<String>> forgotPassword() {
        return ResponseEntity.ok(GlobalResponse.success("Handled by Firebase Auth UI", null));
    }

    @GetMapping("/me")
    public ResponseEntity<GlobalResponse<UserEntity>> getCurrentUser() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String uid = auth.getName();
            UserEntity user = authService.loginUser(uid); 
            return ResponseEntity.ok(GlobalResponse.success("User fetched successfully", user));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(GlobalResponse.error(e.getMessage()));
        }
    }
}
