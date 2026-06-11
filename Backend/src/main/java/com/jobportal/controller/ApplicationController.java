package com.jobportal.controller;

import com.jobportal.entity.ApplicationEntity;
import com.jobportal.entity.ApplicationLogEntity;
import com.jobportal.response.GlobalResponse;
import com.jobportal.service.ApplicationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/applications")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PreAuthorize("hasAuthority('ROLE_JOB_SEEKER')")
    @PostMapping("/apply/{jobId}")
    public ResponseEntity<GlobalResponse<ApplicationEntity>> applyForJob(
            @PathVariable String jobId,
            @RequestBody Map<String, String> payload) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String resumeUrl = payload.get("resumeUrl");
            String coverLetter = payload.get("coverLetter");
            
            ApplicationEntity application = applicationService.applyForJob(auth.getName(), jobId, resumeUrl, coverLetter);
            return ResponseEntity.ok(GlobalResponse.success("Application submitted successfully", application));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(GlobalResponse.error(e.getMessage()));
        }
    }

    @PreAuthorize("hasAuthority('ROLE_JOB_SEEKER')")
    @GetMapping("/me")
    public ResponseEntity<GlobalResponse<List<ApplicationEntity>>> getMyApplications() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            List<ApplicationEntity> apps = applicationService.getCandidateApplications(auth.getName());
            return ResponseEntity.ok(GlobalResponse.success("Fetched applications", apps));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(GlobalResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/{applicationId}")
    public ResponseEntity<GlobalResponse<ApplicationEntity>> getApplicationDetails(@PathVariable String applicationId) {
        try {
            // Note: In production, verify ownership before returning details.
            ApplicationEntity app = applicationService.getApplicationDetails(applicationId);
            return ResponseEntity.ok(GlobalResponse.success("Fetched application details", app));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(GlobalResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/{applicationId}/logs")
    public ResponseEntity<GlobalResponse<List<ApplicationLogEntity>>> getApplicationLogs(@PathVariable String applicationId) {
        try {
            List<ApplicationLogEntity> logs = applicationService.getApplicationLogs(applicationId);
            return ResponseEntity.ok(GlobalResponse.success("Fetched application timeline", logs));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(GlobalResponse.error(e.getMessage()));
        }
    }

    @PreAuthorize("hasAuthority('ROLE_RECRUITER') or hasAuthority('ROLE_PENDING_RECRUITER') or hasAuthority('ROLE_ADMIN')")
    @GetMapping("/job/{jobId}")
    public ResponseEntity<GlobalResponse<List<ApplicationEntity>>> getJobApplications(@PathVariable String jobId) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            List<ApplicationEntity> apps = applicationService.getJobApplications(auth.getName(), jobId);
            return ResponseEntity.ok(GlobalResponse.success("Fetched job applications", apps));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(GlobalResponse.error(e.getMessage()));
        }
    }

    @PreAuthorize("hasAuthority('ROLE_RECRUITER') or hasAuthority('ROLE_PENDING_RECRUITER') or hasAuthority('ROLE_ADMIN')")
    @PatchMapping("/{applicationId}/status")
    public ResponseEntity<GlobalResponse<Void>> updateApplicationStatus(
            @PathVariable String applicationId,
            @RequestBody Map<String, String> payload) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String newStatus = payload.get("status");
            String notes = payload.get("notes");
            
            applicationService.updateApplicationStatus(auth.getName(), applicationId, newStatus, notes);
            return ResponseEntity.ok(GlobalResponse.success("Status updated to " + newStatus, null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(GlobalResponse.error(e.getMessage()));
        }
    }
}
