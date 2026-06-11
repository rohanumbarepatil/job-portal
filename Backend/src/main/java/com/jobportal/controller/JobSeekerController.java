package com.jobportal.controller;

import com.jobportal.dto.response.PublicProfileResponse;
import com.jobportal.entity.JobSeekerProfile;
import com.jobportal.response.GlobalResponse;
import com.jobportal.service.GeminiResumeParserService;
import com.jobportal.service.JobSeekerProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/seekers")
public class JobSeekerController {

    private final JobSeekerProfileService profileService;
    private final GeminiResumeParserService parserService;

    public JobSeekerController(JobSeekerProfileService profileService, GeminiResumeParserService parserService) {
        this.profileService = profileService;
        this.parserService = parserService;
    }

    @GetMapping("/username/check")
    public ResponseEntity<GlobalResponse<Boolean>> checkUsername(@RequestParam String username) {
        try {
            boolean available = profileService.isUsernameAvailable(username);
            return ResponseEntity.ok(GlobalResponse.success("Username check complete", available));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(GlobalResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<GlobalResponse<JobSeekerProfile>> getMyProfile() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            JobSeekerProfile profile = profileService.getProfile(auth.getName());
            return ResponseEntity.ok(GlobalResponse.success("Profile fetched", profile));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(GlobalResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/me")
    public ResponseEntity<GlobalResponse<JobSeekerProfile>> updateMyProfile(@RequestBody JobSeekerProfile updateRequest) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            JobSeekerProfile profile = profileService.updateProfile(auth.getName(), updateRequest);
            return ResponseEntity.ok(GlobalResponse.success("Profile updated", profile));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(GlobalResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/public/{username}")
    public ResponseEntity<GlobalResponse<PublicProfileResponse>> getPublicProfile(@PathVariable String username) {
        try {
            PublicProfileResponse profile = profileService.getPublicProfile(username);
            return ResponseEntity.ok(GlobalResponse.success("Public profile fetched", profile));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(GlobalResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/resume/parse")
    public ResponseEntity<GlobalResponse<String>> parseResume(@RequestParam("file") MultipartFile file) {
        try {
            String parsedJson = parserService.parseResume(file);
            return ResponseEntity.ok(GlobalResponse.success("Resume parsed successfully", parsedJson));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(GlobalResponse.error(e.getMessage()));
        }
    }
}
