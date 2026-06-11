package com.jobportal.service;

import com.jobportal.entity.AICandidateRankingEntity;
import com.jobportal.entity.JobEntity;
import com.jobportal.repository.AICandidateRankingRepository;
import com.jobportal.repository.JobRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AIAnalyticsService {

    private final AICandidateRankingRepository rankingRepository;
    private final JobRepository jobRepository;

    public AIAnalyticsService(AICandidateRankingRepository rankingRepository, JobRepository jobRepository) {
        this.rankingRepository = rankingRepository;
        this.jobRepository = jobRepository;
    }

    public Map<String, Object> getRecruiterAIAnalytics(String recruiterUid) throws Exception {
        List<JobEntity> jobs = jobRepository.findByRecruiterUid(recruiterUid);
        
        int totalRankings = 0;
        int totalScoreSum = 0;
        int strongMatches = 0; // > 80 score

        for (JobEntity job : jobs) {
            List<AICandidateRankingEntity> rankings = rankingRepository.findByJobId(job.getJobId());
            for (AICandidateRankingEntity ranking : rankings) {
                totalRankings++;
                totalScoreSum += ranking.getTotalScore();
                if (ranking.getTotalScore() >= 80) strongMatches++;
            }
        }

        Map<String, Object> analytics = new HashMap<>();
        analytics.put("totalAIAnalyses", totalRankings);
        analytics.put("averageMatchScore", totalRankings > 0 ? (totalScoreSum / totalRankings) : 0);
        analytics.put("highlyRecommendedCandidates", strongMatches);
        return analytics;
    }
}
