package com.jobportal.service;

import com.jobportal.entity.AICandidateRankingEntity;
import com.jobportal.entity.JobEntity;
import com.jobportal.repository.JobRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CandidateRecommendationService {

    private final ResumeRankingService rankingService;
    private final JobRepository jobRepository;

    public CandidateRecommendationService(ResumeRankingService rankingService, JobRepository jobRepository) {
        this.rankingService = rankingService;
        this.jobRepository = jobRepository;
    }

    public List<AICandidateRankingEntity> getRecommendedJobsForCandidate(String candidateUid) throws Exception {
        // Fetch recently active jobs (simulate a query for ACTIVE jobs)
        // In a real prod environment we would use a vector database or keyword
        // filtering first to narrow down from 10k jobs to top 50, then Gemini them.
        List<JobEntity> activeJobs = jobRepository.findActiveJobs(); // Assuming this returns a limited active set for
                                                                     // this prototype

        List<AICandidateRankingEntity> rankings = new ArrayList<>();

        for (JobEntity job : activeJobs) {
            if ("ACTIVE".equals(job.getStatus())) {
                try {
                    // Lazy evaluate
                    AICandidateRankingEntity ranking = rankingService.getOrGenerateRanking(job.getJobId(),
                            candidateUid);
                    if (ranking.getTotalScore() > 50) { // Only recommend > 50% match
                        rankings.add(ranking);
                    }
                } catch (Exception ignore) {
                }
            }
        }

        // Sort descending by totalScore
        rankings.sort((a, b) -> Integer.compare(b.getTotalScore(), a.getTotalScore()));

        // Return top 10
        return rankings.size() > 10 ? rankings.subList(0, 10) : rankings;
    }
}
