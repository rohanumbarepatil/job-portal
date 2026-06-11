package com.jobportal.service;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class InterviewAnalyticsService {

    // Mocked for MVP. In a real system, these would aggregate over the `interviews` and `interview_feedback` collections.
    public Map<String, Object> getInterviewMetrics(String recruiterUid) {
        Map<String, Object> metrics = new HashMap<>();
        
        metrics.put("interviewsScheduled", 150);
        metrics.put("interviewsCompleted", 120);
        metrics.put("passRate", 45.5); // %
        metrics.put("rejectionRate", 54.5); // %
        metrics.put("offerRate", 15.0); // %
        metrics.put("averageTimeInStages", "14 days");
        
        return metrics;
    }
}
