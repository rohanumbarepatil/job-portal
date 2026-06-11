package com.jobportal.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserEntity {
    private String uid;
    private String email;
    private String fullName;
    private String role; 
    private String verificationStatus; // PENDING, APPROVED, REJECTED
    private boolean profileCompleted;
    private boolean isActive;
    private String createdAt;
    private String lastLogin;
    private String provider;
}
