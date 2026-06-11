package com.jobportal.controller;

import com.jobportal.entity.InterviewEntity;
import com.jobportal.entity.InterviewFeedbackEntity;
import com.jobportal.response.GlobalResponse;
import com.jobportal.service.InterviewAnalyticsService;
import com.jobportal.service.InterviewService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/interviews")
public class InterviewController {

    private final InterviewService interviewService;
    private final InterviewAnalyticsService analyticsService;

    public InterviewController(InterviewService interviewService, InterviewAnalyticsService analyticsService) {
        this.interviewService = interviewService;
        this.analyticsService = analyticsService;
    }

    // --- Recruiter Endpoints ---
    @PostMapping
    public ResponseEntity<GlobalResponse<InterviewEntity>> scheduleInterview(@RequestBody InterviewEntity payload) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            InterviewEntity interview = interviewService.scheduleInterview(auth.getName(), payload.getApplicationId(), payload);
            return ResponseEntity.ok(GlobalResponse.success("Interview scheduled", interview));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(GlobalResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/company")
    public ResponseEntity<GlobalResponse<List<InterviewEntity>>> getRecruiterInterviews() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            List<InterviewEntity> list = interviewService.getRecruiterInterviews(auth.getName());
            return ResponseEntity.ok(GlobalResponse.success("Interviews fetched", list));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(GlobalResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/{interviewId}/feedback")
    public ResponseEntity<GlobalResponse<Void>> submitFeedback(
            @PathVariable String interviewId,
            @RequestBody Map<String, Object> payload) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            
            // Extract next step
            String nextStepStatus = (String) payload.get("nextStepStatus");
            
            // Map remaining to Feedback Entity
            InterviewFeedbackEntity feedback = new InterviewFeedbackEntity();
            feedback.setInterviewerName((String) payload.get("interviewerName"));
            feedback.setTechnicalScore((Integer) payload.get("technicalScore"));
            feedback.setCommunicationScore((Integer) payload.get("communicationScore"));
            feedback.setProblemSolvingScore((Integer) payload.get("problemSolvingScore"));
            feedback.setOverallRating((Integer) payload.get("overallRating"));
            feedback.setRecommendation((String) payload.get("recommendation"));
            feedback.setFeedback((String) payload.get("feedback"));

            interviewService.submitFeedback(auth.getName(), interviewId, feedback, nextStepStatus);
            return ResponseEntity.ok(GlobalResponse.success("Feedback submitted and status updated", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(GlobalResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/{interviewId}/feedback")
    public ResponseEntity<GlobalResponse<InterviewFeedbackEntity>> getFeedback(@PathVariable String interviewId) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            return ResponseEntity.ok(GlobalResponse.success("Feedback fetched", interviewService.getFeedback(auth.getName(), interviewId)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(GlobalResponse.error(e.getMessage()));
        }
    }

    // --- Candidate Endpoints ---
    @GetMapping("/me")
    public ResponseEntity<GlobalResponse<List<InterviewEntity>>> getMyInterviews() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            List<InterviewEntity> list = interviewService.getCandidateInterviews(auth.getName());
            return ResponseEntity.ok(GlobalResponse.success("Interviews fetched", list));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(GlobalResponse.error(e.getMessage()));
        }
    }

    // --- Analytics ---
    @GetMapping("/analytics")
    public ResponseEntity<GlobalResponse<Map<String, Object>>> getAnalytics() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            return ResponseEntity.ok(GlobalResponse.success("Metrics fetched", analyticsService.getInterviewMetrics(auth.getName())));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(GlobalResponse.error(e.getMessage()));
        }
    }
}
