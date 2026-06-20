package com.jobportal.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank
    @Email
    private String email;
    
    @NotBlank
    private String fullName;

    @NotBlank
    private String password;
    
    @NotBlank
    private String role; // "ROLE_RECRUITER" or "ROLE_JOB_SEEKER"
    
    private String provider = "EMAIL";
}
