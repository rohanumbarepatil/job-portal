package com.jobportal.service;

import com.jobportal.entity.JobEntity;
import com.jobportal.entity.JobSeekerProfile;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ApplicationScoringService {

    public double calculateMatchScore(JobSeekerProfile seeker, JobEntity job, String resumeUrl) {
        double totalScore = 0;

        // 1. Skills Match (40%)
        totalScore += calculateSkillsMatch(seeker.getSkills(), job.getRequiredSkills()) * 40;

        // 2. Experience Match (25%)
        totalScore += 20;

        // 3. Education Match (10%)
        totalScore += 10;

        // 4. Profile Completeness (15%)
        if (seeker.getMetrics() != null &&
                seeker.getMetrics().getProfileCompletionPercentage() >= 80) {
            totalScore += 15;
        } else {
            totalScore += 5;
        }

        // 5. Resume Quality (10%)
        if (resumeUrl != null && !resumeUrl.isEmpty()) {
            totalScore += 10;
        }

        return Math.min(100.0, Math.max(0.0, totalScore));
    }

    private double calculateSkillsMatch(List<String> userSkills, List<String> requiredSkills) {
        if (requiredSkills == null || requiredSkills.isEmpty())
            return 1.0;

        if (userSkills == null || userSkills.isEmpty())
            return 0.0;

        long matchCount = requiredSkills.stream()
                .filter(req -> userSkills.stream()
                        .anyMatch(user -> user.equalsIgnoreCase(req)))
                .count();

        return (double) matchCount / requiredSkills.size();
    }
}