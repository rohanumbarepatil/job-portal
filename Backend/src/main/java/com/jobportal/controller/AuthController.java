package com.jobportal.controller;

import com.jobportal.dto.request.LoginRequest;
import com.jobportal.dto.request.RegisterRequest;
import com.jobportal.entity.UserEntity;
import com.jobportal.response.GlobalResponse;
import com.jobportal.security.CustomUserDetails;
import com.jobportal.security.JwtUtil;
import com.jobportal.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public AuthController(AuthService authService, AuthenticationManager authenticationManager, JwtUtil jwtUtil) {
        this.authService = authService;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<GlobalResponse<Map<String, Object>>> register(@Valid @RequestBody RegisterRequest request) {
        try {
            // Generate a random UUID for the new user
            String uid = UUID.randomUUID().toString();
            UserEntity user = authService.registerUser(uid, request);
            
            // Generate token after successful registration
            String token = jwtUtil.generateJwtTokenForUser(user.getUid(), user.getRole());
            
            Map<String, Object> data = new HashMap<>();
            data.put("token", token);
            data.put("user", user);

            return ResponseEntity.ok(GlobalResponse.success("User registered successfully", data));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(GlobalResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<GlobalResponse<Map<String, Object>>> login(@Valid @RequestBody LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtil.generateJwtToken(authentication);

            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

            Map<String, Object> data = new HashMap<>();
            data.put("token", jwt);
            data.put("user", userDetails.getUser());

            return ResponseEntity.ok(GlobalResponse.success("Login successful", data));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(GlobalResponse.error("Invalid credentials"));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<GlobalResponse<UserEntity>> getCurrentUser() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
                return ResponseEntity.status(401).body(GlobalResponse.error("Not authenticated"));
            }
            
            CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();
            return ResponseEntity.ok(GlobalResponse.success("Current user details fetched", userDetails.getUser()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(GlobalResponse.error(e.getMessage()));
        }
    }
}
