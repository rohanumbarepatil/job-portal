package com.jobportal.service;

import com.jobportal.dto.GeminiRankingResponseDTO;
import com.jobportal.entity.AICandidateRankingEntity;
import com.jobportal.entity.AIScoringLogEntity;
import com.jobportal.entity.JobEntity;
import com.jobportal.entity.JobSeekerProfile;
import com.jobportal.entity.ApplicationEntity;
import com.jobportal.repository.AICandidateRankingRepository;
import com.jobportal.repository.AIScoringLogRepository;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.JobSeekerProfileRepository;
import com.jobportal.repository.ApplicationRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class ResumeRankingService {

    private final AICandidateRankingRepository rankingRepository;
    private final AIScoringLogRepository scoringLogRepository;
    private final JobRepository jobRepository;
    private final JobSeekerProfileRepository profileRepository;
    private final ApplicationRepository applicationRepository;
    private final GeminiMatchingService geminiService;

    public ResumeRankingService(AICandidateRankingRepository rankingRepository,
            AIScoringLogRepository scoringLogRepository,
            JobRepository jobRepository,
            JobSeekerProfileRepository profileRepository,
            ApplicationRepository applicationRepository,
            GeminiMatchingService geminiService) {
        this.rankingRepository = rankingRepository;
        this.scoringLogRepository = scoringLogRepository;
        this.jobRepository = jobRepository;
        this.profileRepository = profileRepository;
        this.applicationRepository = applicationRepository;
        this.geminiService = geminiService;
    }

    public AICandidateRankingEntity getOrGenerateRanking(String jobId, String candidateUid) throws Exception {
        String rankingId = jobId + "_" + candidateUid;
        AICandidateRankingEntity cachedRanking = rankingRepository.findById(rankingId).orElse(null);

        if (cachedRanking != null && !cachedRanking.isStale()) {
            return cachedRanking; // Cache Hit
        }

        // Cache Miss or Stale -> Lazy Evaluation
        JobEntity job = jobRepository.findById(jobId).orElse(null);
        if (job == null)
            throw new RuntimeException("Job not found");

        JobSeekerProfile profile = profileRepository.findById(candidateUid).orElse(null);
        if (profile == null)
            throw new RuntimeException("Profile not found");

        GeminiRankingResponseDTO dto;
        try {
            // 1. Call Gemini
            dto = geminiService.rankCandidate(job, profile);
        } catch (Exception e) {
            System.err.println("Gemini AI failed, using fallback keyword matching: " + e.getMessage());
            // Fallback Logic: Count matched skills
            String reqSkills = job.getRequiredSkills() != null ? job.getRequiredSkills().toString().toLowerCase() : "";
            String userSkills = profile.getSkills() != null ? profile.getSkills().toString().toLowerCase() : "";
            int matchCount = 0;
            String[] reqArray = reqSkills.split("[,\\s]+");
            for (String s : reqArray) {
                if (!s.isEmpty() && userSkills.contains(s)) {
                    matchCount++;
                }
            }
            int totalScore = reqArray.length > 0 ? (int) Math.min(100, ((double) matchCount / reqArray.length) * 100 + 30) : 50; // Give a baseline 30
            
            dto = GeminiRankingResponseDTO.builder()
                    .totalScore(totalScore)
                    .skillsMatch(Math.min(40, (int)((double)matchCount/Math.max(1, reqArray.length) * 40)))
                    .experienceMatch(20)
                    .educationMatch(10)
                    .profileStrength(10)
                    .resumeQuality(10)
                    .aiExplanation("Score generated via fallback keyword matching due to AI service unavailability.")
                    .build();
        }

        // 2. Save Ranking
        AICandidateRankingEntity ranking = AICandidateRankingEntity.builder()
                .rankingId(rankingId)
                .candidateUid(candidateUid)
                .jobId(jobId)
                .totalScore(dto.getTotalScore())
                .skillsMatch(dto.getSkillsMatch())
                .experienceMatch(dto.getExperienceMatch())
                .educationMatch(dto.getEducationMatch())
                .profileStrength(dto.getProfileStrength())
                .resumeQuality(dto.getResumeQuality())
                .aiExplanation(dto.getAiExplanation())
                .stale(false)
                .updatedAt(Instant.now().toString())
                .build();

        rankingRepository.save(ranking);

        // 3. Save Log
        AIScoringLogEntity log = AIScoringLogEntity.builder()
                .logId(UUID.randomUUID().toString())
                .type(cachedRanking == null ? "RANKING_GENERATED" : "RANKING_RECALCULATED")
                .targetId(rankingId)
                .reason("Lazy evaluation triggered")
                .timestamp(Instant.now().toString())
                .build();
        scoringLogRepository.save(log);

        return ranking;
    }

    public void invalidateJobRankings(String jobId) {
        try {
            var rankings = rankingRepository.findByJobId(jobId);
            for (var r : rankings) {
                r.setStale(true);
                rankingRepository.save(r);
            }
        } catch (Exception e) {
            System.err.println("Failed to invalidate job rankings: " + e.getMessage());
        }
    }

    public void invalidateCandidateRankings(String candidateUid) {
        try {
            var rankings = rankingRepository.findByCandidateUid(candidateUid);
            for (var r : rankings) {
                r.setStale(true);
                rankingRepository.save(r);
            }
        } catch (Exception e) {
            System.err.println("Failed to invalidate candidate rankings: " + e.getMessage());
        }
    }

    public List<AICandidateRankingEntity> getOrGenerateRankingBatchForJob(String jobId) throws Exception {
        // Fetch all candidates who applied to this job
        List<ApplicationEntity> applications = applicationRepository.findByJobIdOrderByCreatedAtDesc(jobId);
        List<AICandidateRankingEntity> rankings = new ArrayList<>();

        for (ApplicationEntity app : applications) {
            try {
                AICandidateRankingEntity ranking = getOrGenerateRanking(jobId, app.getCandidateUid());
                rankings.add(ranking);
            } catch (Exception ignore) {
            }
        }

        // Sort descending by total score
        rankings.sort((a, b) -> Integer.compare(b.getTotalScore(), a.getTotalScore()));
        return rankings;
    }
}
