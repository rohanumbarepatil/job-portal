package com.jobportal.controller;

import com.jobportal.entity.AdminLogEntity;
import com.jobportal.entity.VerificationRequestEntity;
import com.jobportal.repository.AdminLogRepository;
import com.jobportal.response.GlobalResponse;
import com.jobportal.service.AdminAnalyticsService;
import com.jobportal.service.AdminModerationService;
import com.jobportal.service.AdminVerificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class AdminController {

    private final AdminModerationService moderationService;
    private final AdminVerificationService verificationService;
    private final AdminAnalyticsService analyticsService;
    private final AdminLogRepository adminLogRepository;

    public AdminController(AdminModerationService moderationService, 
                           AdminVerificationService verificationService, 
                           AdminAnalyticsService analyticsService,
                           AdminLogRepository adminLogRepository) {
        this.moderationService = moderationService;
        this.verificationService = verificationService;
        this.analyticsService = analyticsService;
        this.adminLogRepository = adminLogRepository;
    }

    // Analytics Endpoints
    @GetMapping("/analytics/kpis")
    public ResponseEntity<GlobalResponse<Map<String, Object>>> getKPIs() {
        try {
            return ResponseEntity.ok(GlobalResponse.success("KPIs fetched", analyticsService.getPlatformKPIs()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(GlobalResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/analytics/charts")
    public ResponseEntity<GlobalResponse<Map<String, Object>>> getCharts() {
        try {
            return ResponseEntity.ok(GlobalResponse.success("Charts fetched", analyticsService.getGrowthCharts()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(GlobalResponse.error(e.getMessage()));
        }
    }

    // Verification Endpoints
    @GetMapping("/verifications")
    public ResponseEntity<GlobalResponse<List<VerificationRequestEntity>>> getAllVerifications() {
        try {
            return ResponseEntity.ok(GlobalResponse.success("Requests fetched", verificationService.getAllRequests()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(GlobalResponse.error(e.getMessage()));
        }
    }

    @PatchMapping("/verifications/{requestId}")
    public ResponseEntity<GlobalResponse<Void>> resolveVerification(
            @PathVariable String requestId,
            @RequestBody Map<String, String> payload) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String status = payload.get("status"); // APPROVED or REJECTED
            String reason = payload.get("reason");
            verificationService.resolveRequest(auth.getName(), requestId, status, reason);
            return ResponseEntity.ok(GlobalResponse.success("Request " + status, null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(GlobalResponse.error(e.getMessage()));
        }
    }

    // Moderation Endpoints
    @PatchMapping("/users/{uid}/suspend")
    public ResponseEntity<GlobalResponse<Void>> suspendUser(@PathVariable String uid, @RequestBody Map<String, String> payload) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            moderationService.suspendUser(auth.getName(), uid, payload.get("reason"));
            return ResponseEntity.ok(GlobalResponse.success("User suspended", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(GlobalResponse.error(e.getMessage()));
        }
    }

    @PatchMapping("/users/{uid}/reactivate")
    public ResponseEntity<GlobalResponse<Void>> reactivateUser(@PathVariable String uid, @RequestBody Map<String, String> payload) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            moderationService.reactivateUser(auth.getName(), uid, payload.get("reason"));
            return ResponseEntity.ok(GlobalResponse.success("User reactivated", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(GlobalResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/jobs/{jobId}")
    public ResponseEntity<GlobalResponse<Void>> removeJob(@PathVariable String jobId, @RequestBody Map<String, String> payload) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            moderationService.removeJob(auth.getName(), jobId, payload.get("reason"));
            return ResponseEntity.ok(GlobalResponse.success("Job removed", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(GlobalResponse.error(e.getMessage()));
        }
    }

    // Audit Logs
    @GetMapping("/logs")
    public ResponseEntity<GlobalResponse<List<AdminLogEntity>>> getLogs() {
        try {
            return ResponseEntity.ok(GlobalResponse.success("Logs fetched", adminLogRepository.findAllLogs()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(GlobalResponse.error(e.getMessage()));
        }
    }
}
