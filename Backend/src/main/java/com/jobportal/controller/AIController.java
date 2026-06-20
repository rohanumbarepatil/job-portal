package com.jobportal.controller;

import com.jobportal.entity.AICandidateRankingEntity;
import com.jobportal.entity.JobEntity;
import com.jobportal.repository.JobRepository;
import com.jobportal.response.GlobalResponse;
import com.jobportal.service.AIAnalyticsService;
import com.jobportal.service.CandidateRecommendationService;
import com.jobportal.service.ResumeRankingService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/ai")
public class AIController {

    private final ResumeRankingService rankingService;
    private final CandidateRecommendationService recommendationService;
    private final AIAnalyticsService analyticsService;
    private final JobRepository jobRepository;

    public AIController(ResumeRankingService rankingService,
            CandidateRecommendationService recommendationService,
            AIAnalyticsService analyticsService,
            JobRepository jobRepository) {
        this.rankingService = rankingService;
        this.recommendationService = recommendationService;
        this.analyticsService = analyticsService;
        this.jobRepository = jobRepository;
    }

    @GetMapping("/rankings/{jobId}/{candidateUid}")
    public ResponseEntity<GlobalResponse<AICandidateRankingEntity>> getRanking(@PathVariable String jobId,
            @PathVariable String candidateUid) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String currentUser = auth.getName();

            // Security: Candidate can only see their own. Recruiter must own the job.
            if (!currentUser.equals(candidateUid)) {
                JobEntity job = jobRepository.findById(jobId).orElse(null);
                if (job == null || !job.getRecruiterUid().equals(currentUser)) {
                    throw new RuntimeException("Unauthorized to view this ranking.");
                }
            }

            AICandidateRankingEntity ranking = rankingService.getOrGenerateRanking(jobId, candidateUid);
            return ResponseEntity.ok(GlobalResponse.success("Ranking retrieved.", ranking));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(GlobalResponse.error(e.getMessage()));
        }
    }

    @PreAuthorize("hasAuthority('ROLE_JOB_SEEKER')")
    @GetMapping("/recommendations/jobs")
    public ResponseEntity<GlobalResponse<List<AICandidateRankingEntity>>> getRecommendedJobs() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            List<AICandidateRankingEntity> recommendations = recommendationService
                    .getRecommendedJobsForCandidate(auth.getName());
            return ResponseEntity.ok(GlobalResponse.success("Recommended jobs retrieved.", recommendations));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(GlobalResponse.error(e.getMessage()));
        }
    }

    @PreAuthorize("hasAuthority('ROLE_RECRUITER') or hasAuthority('ROLE_PENDING_RECRUITER') or hasAuthority('ROLE_ADMIN')")
    @GetMapping("/recommendations/candidates/{jobId}")
    public ResponseEntity<GlobalResponse<List<AICandidateRankingEntity>>> getRecommendedCandidates(
            @PathVariable String jobId) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();

            // Security: Recruiter must own the job.
            JobEntity job = jobRepository.findById(jobId).orElse(null);
            if (job == null || !job.getRecruiterUid().equals(auth.getName())) {
                throw new RuntimeException("Unauthorized to view recommendations for this job.");
            }

            // For now, return existing cached rankings for this job sorted by score.
            // In a real scenario we'd do a batch evaluation over applied candidates.
            List<AICandidateRankingEntity> rankings = rankingService.getOrGenerateRankingBatchForJob(jobId); // We'll
                                                                                                             // assume
                                                                                                             // the
                                                                                                             // cache
                                                                                                             // query
                                                                                                             // method
            return ResponseEntity.ok(GlobalResponse.success("Recommended candidates retrieved.", rankings));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(GlobalResponse.error(e.getMessage()));
        }
    }

    @PreAuthorize("hasAuthority('ROLE_RECRUITER') or hasAuthority('ROLE_PENDING_RECRUITER') or hasAuthority('ROLE_ADMIN')")
    @GetMapping("/analytics")
    public ResponseEntity<GlobalResponse<Map<String, Object>>> getAnalytics() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            Map<String, Object> analytics = analyticsService.getRecruiterAIAnalytics(auth.getName());
            return ResponseEntity.ok(GlobalResponse.success("Analytics retrieved.", analytics));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(GlobalResponse.error(e.getMessage()));
        }
    }
}
