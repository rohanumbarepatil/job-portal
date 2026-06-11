package com.jobportal.controller;

import com.jobportal.entity.JobEntity;
import com.jobportal.entity.SavedJobEntity;
import com.jobportal.response.GlobalResponse;
import com.jobportal.service.JobService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/jobs")
public class JobController {

    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    @PreAuthorize("hasAuthority('ROLE_RECRUITER') or hasAuthority('ROLE_PENDING_RECRUITER') or hasAuthority('ROLE_ADMIN')")
    @PostMapping
    public ResponseEntity<GlobalResponse<JobEntity>> createJob(@RequestBody JobEntity request) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            JobEntity job = jobService.createJob(auth.getName(), request);
            return ResponseEntity.ok(GlobalResponse.success("Job created successfully", job));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(GlobalResponse.error(e.getMessage()));
        }
    }

    @PreAuthorize("hasAuthority('ROLE_RECRUITER') or hasAuthority('ROLE_PENDING_RECRUITER') or hasAuthority('ROLE_ADMIN')")
    @PutMapping("/{jobId}")
    public ResponseEntity<GlobalResponse<JobEntity>> updateJob(@PathVariable String jobId, @RequestBody JobEntity request) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            boolean isAdmin = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
            JobEntity job = jobService.updateJob(auth.getName(), jobId, request, isAdmin);
            return ResponseEntity.ok(GlobalResponse.success("Job updated successfully", job));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(GlobalResponse.error(e.getMessage()));
        }
    }

    @PreAuthorize("hasAuthority('ROLE_RECRUITER') or hasAuthority('ROLE_PENDING_RECRUITER') or hasAuthority('ROLE_ADMIN')")
    @DeleteMapping("/{jobId}")
    public ResponseEntity<GlobalResponse<Void>> deleteJob(@PathVariable String jobId) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            boolean isAdmin = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
            jobService.deleteJob(auth.getName(), jobId, isAdmin);
            return ResponseEntity.ok(GlobalResponse.success("Job deleted successfully", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(GlobalResponse.error(e.getMessage()));
        }
    }

    @PreAuthorize("hasAuthority('ROLE_RECRUITER') or hasAuthority('ROLE_PENDING_RECRUITER')")
    @GetMapping("/recruiter")
    public ResponseEntity<GlobalResponse<List<JobEntity>>> getRecruiterJobs() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            List<JobEntity> jobs = jobService.getRecruiterJobs(auth.getName());
            return ResponseEntity.ok(GlobalResponse.success("Fetched recruiter jobs", jobs));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(GlobalResponse.error(e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<GlobalResponse<List<JobEntity>>> searchJobs(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String type) {
        try {
            List<JobEntity> jobs = jobService.searchActiveJobs(keyword, location, type);
            return ResponseEntity.ok(GlobalResponse.success("Jobs fetched successfully", jobs));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(GlobalResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/details/{jobId}")
    public ResponseEntity<GlobalResponse<JobEntity>> getJobDetails(@PathVariable String jobId) {
        try {
            JobEntity job = jobService.getJobDetails(jobId);
            return ResponseEntity.ok(GlobalResponse.success("Job details fetched", job));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(GlobalResponse.error(e.getMessage()));
        }
    }

    @PreAuthorize("hasAuthority('ROLE_JOB_SEEKER')")
    @PostMapping("/{jobId}/save")
    public ResponseEntity<GlobalResponse<SavedJobEntity>> saveJob(@PathVariable String jobId) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            SavedJobEntity savedJob = jobService.saveJob(auth.getName(), jobId);
            return ResponseEntity.ok(GlobalResponse.success("Job saved successfully", savedJob));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(GlobalResponse.error(e.getMessage()));
        }
    }

    @PreAuthorize("hasAuthority('ROLE_JOB_SEEKER')")
    @DeleteMapping("/{jobId}/unsave")
    public ResponseEntity<GlobalResponse<Void>> unsaveJob(@PathVariable String jobId) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            jobService.unsaveJob(auth.getName(), jobId);
            return ResponseEntity.ok(GlobalResponse.success("Job unsaved successfully", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(GlobalResponse.error(e.getMessage()));
        }
    }

    @PreAuthorize("hasAuthority('ROLE_JOB_SEEKER')")
    @GetMapping("/saved")
    public ResponseEntity<GlobalResponse<List<SavedJobEntity>>> getSavedJobs() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            List<SavedJobEntity> jobs = jobService.getSavedJobs(auth.getName());
            return ResponseEntity.ok(GlobalResponse.success("Fetched saved jobs", jobs));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(GlobalResponse.error(e.getMessage()));
        }
    }
}
