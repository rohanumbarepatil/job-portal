package com.jobportal.controller;

import com.jobportal.entity.*;
import com.jobportal.repository.*;
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
    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final JobRepository jobRepository;
    private final InterviewRepository interviewRepository;

    public AdminController(AdminModerationService moderationService,
                           AdminVerificationService verificationService,
                           AdminAnalyticsService analyticsService,
                           AdminLogRepository adminLogRepository,
                           UserRepository userRepository,
                           CompanyRepository companyRepository,
                           JobRepository jobRepository,
                           InterviewRepository interviewRepository) {
        this.moderationService = moderationService;
        this.verificationService = verificationService;
        this.analyticsService = analyticsService;
        this.adminLogRepository = adminLogRepository;
        this.userRepository = userRepository;
        this.companyRepository = companyRepository;
        this.jobRepository = jobRepository;
        this.interviewRepository = interviewRepository;
    }

    // ===================== Analytics =====================
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

    // ===================== User Management =====================
    @GetMapping("/users")
    public ResponseEntity<GlobalResponse<List<UserEntity>>> getAllUsers(
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String search) {
        try {
            List<UserEntity> users = userRepository.findByRoleAndSearch(
                (role != null && !role.isEmpty()) ? role : null,
                (search != null && !search.isEmpty()) ? search : null
            );
            return ResponseEntity.ok(GlobalResponse.success("Users fetched", users));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(GlobalResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/users/{uid}")
    public ResponseEntity<GlobalResponse<UserEntity>> getUserById(@PathVariable String uid) {
        try {
            UserEntity user = userRepository.findById(uid)
                .orElseThrow(() -> new RuntimeException("User not found"));
            return ResponseEntity.ok(GlobalResponse.success("User fetched", user));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(GlobalResponse.error(e.getMessage()));
        }
    }

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

    // ===================== Verification =====================
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
            String status = payload.get("status");
            String reason = payload.get("reason");
            verificationService.resolveRequest(auth.getName(), requestId, status, reason);
            return ResponseEntity.ok(GlobalResponse.success("Request " + status, null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(GlobalResponse.error(e.getMessage()));
        }
    }

    // ===================== Company Management =====================
    @GetMapping("/companies")
    public ResponseEntity<GlobalResponse<List<CompanyEntity>>> getAllCompanies(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search) {
        try {
            List<CompanyEntity> companies = companyRepository.findByStatusAndSearch(
                (status != null && !status.isEmpty()) ? status : null,
                (search != null && !search.isEmpty()) ? search : null
            );
            return ResponseEntity.ok(GlobalResponse.success("Companies fetched", companies));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(GlobalResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/companies/{companyId}")
    public ResponseEntity<GlobalResponse<CompanyEntity>> getCompanyById(@PathVariable String companyId) {
        try {
            CompanyEntity company = companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found"));
            return ResponseEntity.ok(GlobalResponse.success("Company fetched", company));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(GlobalResponse.error(e.getMessage()));
        }
    }

    @PatchMapping("/companies/{companyId}/verify")
    public ResponseEntity<GlobalResponse<Void>> verifyCompany(
            @PathVariable String companyId,
            @RequestBody Map<String, String> payload) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            CompanyEntity company = companyRepository.findById(companyId)
                .orElseThrow(() -> new RuntimeException("Company not found"));
            company.setVerificationStatus(payload.getOrDefault("status", "VERIFIED"));
            companyRepository.save(company);
            return ResponseEntity.ok(GlobalResponse.success("Company status updated", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(GlobalResponse.error(e.getMessage()));
        }
    }

    // ===================== Job Moderation =====================
    @GetMapping("/jobs")
    public ResponseEntity<GlobalResponse<List<JobEntity>>> getAllJobs(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search) {
        try {
            List<JobEntity> jobs = jobRepository.findByStatusAndSearch(
                (status != null && !status.isEmpty()) ? status : null,
                (search != null && !search.isEmpty()) ? search : null
            );
            return ResponseEntity.ok(GlobalResponse.success("Jobs fetched", jobs));
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

    @PatchMapping("/jobs/{jobId}/block")
    public ResponseEntity<GlobalResponse<Void>> blockJob(@PathVariable String jobId) {
        try {
            JobEntity job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));
            job.setStatus("CLOSED");
            jobRepository.save(job);
            return ResponseEntity.ok(GlobalResponse.success("Job blocked", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(GlobalResponse.error(e.getMessage()));
        }
    }

    // ===================== Interview Management =====================
    @GetMapping("/interviews")
    public ResponseEntity<GlobalResponse<List<InterviewEntity>>> getAllInterviews() {
        try {
            List<InterviewEntity> interviews = interviewRepository.findAll();
            interviews.sort((a, b) -> {
                if (a.getScheduledAt() == null) return 1;
                if (b.getScheduledAt() == null) return -1;
                return b.getScheduledAt().compareTo(a.getScheduledAt());
            });
            return ResponseEntity.ok(GlobalResponse.success("Interviews fetched", interviews));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(GlobalResponse.error(e.getMessage()));
        }
    }

    @PatchMapping("/interviews/{interviewId}/cancel")
    public ResponseEntity<GlobalResponse<Void>> cancelInterview(@PathVariable String interviewId) {
        try {
            InterviewEntity interview = interviewRepository.findById(interviewId)
                .orElseThrow(() -> new RuntimeException("Interview not found"));
            interview.setStatus("CANCELLED");
            interviewRepository.save(interview);
            return ResponseEntity.ok(GlobalResponse.success("Interview cancelled", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(GlobalResponse.error(e.getMessage()));
        }
    }

    // ===================== Audit Logs =====================
    @GetMapping("/logs")
    public ResponseEntity<GlobalResponse<List<AdminLogEntity>>> getLogs() {
        try {
            List<AdminLogEntity> logs = adminLogRepository.findAll();
            logs.sort((a, b) -> {
                if (a.getTimestamp() == null) return 1;
                if (b.getTimestamp() == null) return -1;
                return b.getTimestamp().compareTo(a.getTimestamp());
            });
            return ResponseEntity.ok(GlobalResponse.success("Logs fetched", logs));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(GlobalResponse.error(e.getMessage()));
        }
    }
}
